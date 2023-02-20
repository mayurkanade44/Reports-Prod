import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  InputRow,
  InputSelect,
  Loading,
  SearchContainer,
  ReportStats,
} from "../components";
import { addAdminValues } from "../redux/adminSlice";
import {
  allReports,
  changePage,
  editReport,
  mailForm,
  reportHandleChange,
  sendEmail,
} from "../redux/reportSlice";
import {
  getAllUsers,
  handleUserChange,
  register,
  userDelete,
} from "../redux/userSlice";

const Dashboard = () => {
  const { userLoading, allUsers, name, email, password, role } = useSelector(
    (store) => store.user
  );
  const {
    reports,
    reportLoading,
    search,
    reportsStats,
    mailId,
    emailList,
    totalPages,
    page,
  } = useSelector((store) => store.report);
  const { adminLoading } = useSelector((store) => store.admin);
  const ref = useRef();
  const dispatch = useDispatch();
  const [show, setShow] = useState("All Reports");
  const [form, setForm] = useState({
    template: "",
    report: "",
    doc: "",
  });

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(allReports());

    // eslint-disable-next-line
  }, [page]);

  const handleDelete = (id) => {
    dispatch(userDelete(id));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, role, password }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(allReports(search));
  };

  const handleMailForm = (id, emails) => {
    dispatch(mailForm({ id, emails }));
  };

  const handleSendMail = (e) => {
    e.preventDefault();
    let emails = form.template;
    dispatch(sendEmail({ emailList, emails, mailId }));
  };

  const addTemplate = async (e) => {
    e.preventDefault();

    const form1 = new FormData();

    form1.set("templateType", form.template);
    form1.set("reportType", form.report);
    form1.append("file", form.doc);

    await dispatch(addAdminValues(form1));
    ref.current.value = "";
    setForm({ template: "", report: "", doc: "" });
  };

  const handleFile = (id, file) => {
    const form = new FormData();

    form.append("file", file);
    dispatch(editReport({ id, form }));
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (reportLoading || userLoading) return <Loading />;

  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-2">
          <button
            className="btn btn-primary"
            onClick={(e) => setShow(e.target.textContent)}
          >
            All Reports
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary"
            onClick={(e) => setShow(e.target.textContent)}
          >
            All Users
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary"
            onClick={(e) => setShow(e.target.textContent)}
          >
            Add Template
          </button>
        </div>
        <div className="col-4">
          <SearchContainer
            name="search"
            value={search}
            placeholder="Enter report name"
            handleSearch={handleSearch}
            handleChange={(e) =>
              dispatch(
                reportHandleChange({
                  name: e.target.name,
                  value: e.target.value,
                })
              )
            }
          />
        </div>
        {mailId.length > 0 ? (
          <div>
            <h6>Emails - {emailList.toString()}</h6>
            <div className="col-6 d-flex">
              <InputRow
                label="Extra Email:"
                type="email"
                value={form.template}
                handleChange={(e) =>
                  setForm({ ...form, template: e.target.value })
                }
              />
              <button
                className="btn btn-success btn-sm ms-3"
                onClick={handleSendMail}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <ReportStats data={reportsStats} />
        )}
        {show === "All Users" && (
          <>
            <div className="col-2 mt-2">
              <button
                className="btn btn-primary"
                onClick={(e) => setShow(e.target.textContent)}
              >
                Register User
              </button>
            </div>
            <div className="col-12">
              <Table
                user="Admin"
                th1="Name"
                th2="Role"
                th3="Delete"
                data={allUsers}
                handleButton={handleDelete}
              />
            </div>
          </>
        )}
        {show === "All Reports" && (
          <div className="col-12">
            <Table
              th1="Report Name"
              th2="Report By"
              th3="Inspection Date"
              th4="Actions"
              data={reports}
              handleButton={handleMailForm}
              handleFile={handleFile}
            />
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {pages.map((page) => (
                  <li className="page-item" key={page}>
                    <button
                      className="page-link"
                      onClick={(e) =>
                        dispatch(changePage(e.target.textContent))
                      }
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
        {show === "Register User" && (
          <form className="row" onSubmit={handleRegisterSubmit}>
            <div className="col-5">
              <InputRow
                label="Name"
                name="name"
                value={name}
                handleChange={(e) =>
                  dispatch(
                    handleUserChange({
                      name: e.target.name,
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
            <div className="col-4 mb-3">
              <InputSelect
                label="Role:"
                name="role"
                value={role}
                data={["Select", "Back Office", "Operator"]}
                handleChange={(e) =>
                  dispatch(
                    handleUserChange({
                      name: e.target.name,
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
            <div className="col-4">
              <InputRow
                label="User Email"
                type="email"
                name="email"
                value={email}
                placeholder="abc@xyz.com"
                handleChange={(e) =>
                  dispatch(
                    handleUserChange({
                      name: e.target.name,
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
            <div className="col-4">
              <InputRow
                label="Password"
                name="password"
                value={password}
                handleChange={(e) =>
                  dispatch(
                    handleUserChange({
                      name: e.target.name,
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
            <div className="col-auto mt-1">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        )}
        {show === "Add Template" && (
          <form onSubmit={addTemplate}>
            <div className="col-4 my-3">
              <InputSelect
                label="Template:"
                value={form.template}
                data={[
                  "Select",
                  "Single Picture",
                  "Double Picture",
                  "Before-After Picture",
                ]}
                handleChange={(e) =>
                  setForm({ ...form, template: e.target.value })
                }
              />
            </div>
            <div className="col-4 my-3">
              <InputRow
                label="Report Type"
                type="text"
                value={form.report}
                placeholder="Report Name"
                handleChange={(e) =>
                  setForm({ ...form, report: e.target.value })
                }
              />
            </div>
            <div className="col-2">
              <input
                type="file"
                ref={ref}
                onChange={(e) => setForm({ ...form, doc: e.target.files[0] })}
              />
            </div>
            <div className="col-2" style={{ marginTop: 22 }}>
              <button
                className=" btn btn-primary"
                disabled={form.doc ? false : true}
                type="submit"
              >
                {adminLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
