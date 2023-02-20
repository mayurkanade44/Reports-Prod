const ReportStats = ({data}) => {
  return (
    <div className="row mb-2">
      {data?.map((item, index) => (
        <div className="col-md-3" key={index}>
          <div className={`card bg-${item.bg}`}>
            <div className="card-body text-center">
              <p className="card-text" style={{ color: "white" }}>
                {item.text}
              </p>
              <h2 style={{ marginBottom: 0, color: "white" }}>
                {item.count}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ReportStats;
