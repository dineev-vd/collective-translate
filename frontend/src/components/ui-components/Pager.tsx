const Pager: React.FC<{
  page: number;
  maxPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({page, maxPages, setPage}) => {
  return (
    <div>
      <button onClick={() => setPage(prev => prev - 10 > 1 ? prev - 10 : 1)}>{"<<"}</button>
      <button onClick={() => setPage(prev => prev - 1 > 1 ? prev - 1 : 1)}>{"<"}</button>
      <span>{page}</span>
      <button onClick={() => setPage(prev => prev + 1 <= maxPages ? prev + 1 : maxPages)}>{">"}</button>
      <button onClick={() => setPage(prev => prev + 10 <= maxPages ? prev + 10 : maxPages)}>{">>"}</button>
    </div>
  );
};

export default Pager;
