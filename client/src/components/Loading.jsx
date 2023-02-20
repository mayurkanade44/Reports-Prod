const Loading = () => {
  return (
    <div className="modal">
      <div className="position-absolute bottom-50 end-50">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};
export default Loading;
