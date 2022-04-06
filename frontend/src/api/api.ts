class api {
    apiUrl: string = window.location.origin + "/api";

    async getProjectsByQuery(query: string) {
        const response = fetch(this.apiUrl + "/projects")
    }
}