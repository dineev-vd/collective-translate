import { GetActionDto, PostActionDto } from "@common/dto/action.dto";
import { PeekFileDto, ShortFileDto } from "@common/dto/file.dto";
import { GetTranslateLanguage, PostTranslateLanguage } from "@common/dto/language.dto";
import { GetProjectDto, PostProjectDto } from "@common/dto/project.dto";
import { GetTranslationDto } from "@common/dto/translate-piece.dto";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { API_ENDPOINT, AUTH_ENDPOINT, FILE_ENDPOINT, LANGUAGE_ENDPOINT, LOGIN_ENDPOINT, MY_PROFILE_ENDPOINT, PROJECT_ENDPOINT, REFRESH_ENDPOINT, REGISTER_ENDPOINT, TEXT_SEGMENT_ENDPOINT, TRANSLATION_ENDPOINT, USER_ENDPOINT } from "common/constants";
import { JwtDto } from "common/dto/jwt.dto";
import { GetUserDto, PostUserDto } from "common/dto/user.dto";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShouldLogin, setUser } from "store/userReducer";
import { auth } from "./Auth";
import { GetAssemblyDto } from '@common/dto/assembly.dto';

class ApiClass {
    private dispatch: Dispatch<AnyAction>;
    private onUnauthorized: () => void;

    setDispatch(dispatch: Dispatch<AnyAction>, onUnauthorized: () => void) {
        this.dispatch = dispatch;
        this.onUnauthorized = onUnauthorized;
    }


    async parseResponse<T>(response: Response): Promise<[T, Response]> {
        if (response.status === 401) {
            if (this.dispatch) {
                this.dispatch(setUser(null));
                this.onUnauthorized();
            }

        }

        if (!response.ok) {
            throw new Error("Response was not ok: " + response.statusText);
        }

        const json = await response.json();
        return [json, response];
    }

    makeNewInit(init: RequestInit, token: string): RequestInit {
        return token ? { ...init, headers: { ...init.headers, "Authorization": `Bearer ${token}` } } : init;
    }

    async makeRequest(uri: string, options: { init?: RequestInit, tokenRequired: Boolean, credentialsRequired: Boolean }) {
        const { init, tokenRequired, credentialsRequired } = options;
        const newInit = init ?? {};
        newInit.credentials = credentialsRequired ? "include" : "omit";
        console.log(newInit);

        if (tokenRequired) {
            const token = auth.getAccessToken();
            const initBeforeCatch = this.makeNewInit(newInit, token);

            const response = await fetch(uri, initBeforeCatch);
            if (response.status != 401) {
                return response;
            }

            const [newToken, _] = await this.refreshToken();
            auth.setAccessToken(newToken.accessToken);
            const initAfterCatch = this.makeNewInit(newInit, newToken.accessToken);
            return fetch(uri, initAfterCatch);
        }

        return fetch(uri, newInit);
    }

    async getJson<T>(uri: string, { tokenRequired = false, credentialsRequired = false } = {}) {
        const response = await this.makeRequest(uri, { tokenRequired: tokenRequired, credentialsRequired: credentialsRequired });
        return this.parseResponse<T>(response);
    }

    async postJson<T>(uri: string, data?: Object, { tokenRequired = false, credentialsRequired = false } = {}) {
        const response = await this.makeRequest(uri, {
            init: {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
            }, tokenRequired: tokenRequired, credentialsRequired: credentialsRequired
        })
        return this.parseResponse<T>(response);
    }

    async postFile<T>(uri: string, files: FileList, { tokenRequired = false, credentialsRequired = false } = {}) {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append(f.name, f));
        const response = await this.makeRequest(uri, { init: { method: "POST", body: formData }, tokenRequired: tokenRequired, credentialsRequired: credentialsRequired });
        return this.parseResponse<T>(response);
    }

    makeUri(endpoints: Object[] | Object,
        params?: {
            [key: string]: Object[] | Object
        }): string {

        const endpointsParsed = Array.isArray(endpoints) ? endpoints : [endpoints];

        const endpointsString = [API_ENDPOINT, ...endpointsParsed].join('/');
        const paramString = params ? Object.entries(params).map(([key, value]) => {
            if (value === null || value === undefined)
                return;

            const valueParsed = Array.isArray(value) ? value : [value];
            return `${key}=${valueParsed.join(',')}`;
        }).join('&') : "";

        return '/' + endpointsString + (paramString.length > 0 ? '?' : '') + paramString;
    }

    // search for translation project by user-typed query
    async getProjectsByQuery(query: string) {
        const uri = this.makeUri(PROJECT_ENDPOINT, { query: query })
        return this.getJson<GetProjectDto[]>(uri);
    }

    async getProjectById(id: string) {
        const uri = this.makeUri([PROJECT_ENDPOINT, id]);
        return this.getJson<GetProjectDto>(uri);
    }

    async postTextFiles(id: string, files: FileList) {
        const uri = this.makeUri([PROJECT_ENDPOINT, id, FILE_ENDPOINT]);
        return this.postFile<ShortFileDto[]>(uri, files);
    }

    async getTranslation(pieceId: string) {
        const uri = this.makeUri([TRANSLATION_ENDPOINT, pieceId]);
        return this.getJson<GetTranslationDto>(uri);
    }

    async getTextSegment(id: string, params?: { 
        nextMinLength?: number, 
        prevMinLength?: number, 
        toLanguageId?: string,
        withOriginal?: Boolean
    }) {
        const uri = this.makeUri([TRANSLATION_ENDPOINT, id], params);
        return this.getJson<GetTranslationDto[]>(uri);
    }

    async login(email: string, password: string) {
        const uri = this.makeUri([AUTH_ENDPOINT, LOGIN_ENDPOINT]);
        return this.postJson<JwtDto>(uri, { email: email, password: password }, { credentialsRequired: true });
    }

    async register(user: PostUserDto) {
        const uri = this.makeUri([AUTH_ENDPOINT, REGISTER_ENDPOINT]);
        return this.postJson<JwtDto>(uri, user);
    }

    async getUserById(id: string) {
        const uri = this.makeUri([USER_ENDPOINT, id]);
        return this.getJson<GetUserDto>(uri);
    }

    async getProfile() {
        const uri = this.makeUri([USER_ENDPOINT, MY_PROFILE_ENDPOINT]);
        return this.getJson<GetUserDto>(uri, { tokenRequired: true });
    }

    async refreshToken() {
        const uri = this.makeUri([AUTH_ENDPOINT, REFRESH_ENDPOINT]);
        return this.getJson<JwtDto>(uri, { credentialsRequired: true });
    }

    async getTranslationsByOrders(translationId: string, orders: number[]) {
        const uri = this.makeUri([LANGUAGE_ENDPOINT, translationId, 'translations-orders'], { orders: orders });
        return this.getJson<GetTranslationDto[]>(uri);
    }

    async getTranslationsByLanguage(translationId: string, params: { fileId?: string, take?: number, page?: number }) {
        const uri = this.makeUri([LANGUAGE_ENDPOINT, translationId, 'translations'], params);
        return this.getJson<GetTranslationDto[]>(uri);
    }

    async getLanguagesBtProjectId(projectId: number) {
        const uri = this.makeUri([PROJECT_ENDPOINT, projectId, LANGUAGE_ENDPOINT], { projectId: projectId.toString() });
        return this.getJson<GetTranslateLanguage[]>(uri);
    }

    async getLanguagesBySegment(segmentId: string) {
        const uri = this.makeUri([TRANSLATION_ENDPOINT, segmentId, 'languages']);
        return this.getJson<GetTranslateLanguage[]>(uri);
    }

    async getLanguageBySegment(segmentId: string) {
        const uri = this.makeUri([TRANSLATION_ENDPOINT, segmentId, 'language']);
        return this.getJson<GetTranslateLanguage>(uri);
    }

    async getFilesByProject(projectId: number) {
        const uri = this.makeUri([PROJECT_ENDPOINT, projectId, FILE_ENDPOINT]);
        return this.getJson<ShortFileDto[]>(uri);
    }

    async getFilePeek(id: number) {
        const uri = this.makeUri([FILE_ENDPOINT, id, 'peek']);
        return this.getJson<PeekFileDto>(uri);
    }

    async splitFile(id: number) {
        const uri = this.makeUri([FILE_ENDPOINT, id, 'split']);
        return this.postJson(uri);
    }

    async getActions(segmentId: number) {
        const uri = this.makeUri([TRANSLATION_ENDPOINT, segmentId, 'actions']);
        return this.getJson<GetActionDto[]>(uri);
    }

    async postActions(actions: PostActionDto[]) {
        const uri = this.makeUri('actions');
        return this.postJson(uri, actions, { tokenRequired: true });
    }

    async postProject(project: PostProjectDto) {
        const uri = this.makeUri(PROJECT_ENDPOINT);
        return this.postJson<GetProjectDto>(uri, project, { tokenRequired: true });
    }

    async postLanguage(projectId: string, language: PostTranslateLanguage) {
        const uri = this.makeUri([PROJECT_ENDPOINT, projectId, LANGUAGE_ENDPOINT]);
        return this.postJson(uri, language, { tokenRequired: true });
    }

    async getLanguage(languageId: string) {
        const uri = this.makeUri([LANGUAGE_ENDPOINT, languageId]);
        return this.getJson<GetTranslateLanguage>(uri);
    }

    async assembleLanguage(languageId: string) {
        const uri = this.makeUri([LANGUAGE_ENDPOINT, languageId, 'assemble']);
        return this.postJson(uri, undefined, { tokenRequired: true })
    }

    async getAssembliesByLanguage(languageId: string) {
        const uri = this.makeUri([LANGUAGE_ENDPOINT, languageId, 'assemblies']);
        return this.getJson<GetAssemblyDto[]>(uri);
    }
}

export const api = new ApiClass();