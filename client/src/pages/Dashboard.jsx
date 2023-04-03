import FileSaver from "file-saver";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Table,
  InputRow,
  InputSelect,
  Loading,
  SearchContainer,
  ReportStats,
  EmailTable,
} from "../components";
import { addAdminValues, getAdminValues } from "../redux/adminSlice";
import {
  allReports,
  changePage,
  editReport,
  generateReport,
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
  const { userLoading, allUsers, name, email, password, role, user } =
    useSelector((store) => store.user);
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
  const { adminLoading, emailData } = useSelector((store) => store.admin);
  const ref = useRef();
  const dispatch = useDispatch();
  const [show, setShow] = useState("All Reports");
  const [form, setForm] = useState({
    template: "",
    report: "",
    doc: "",
    services: "",
  });

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(allReports());
    dispatch(getAdminValues());

    // eslint-disable-next-line
  }, [page, show]);

  const handleDelete = (id) => {
    dispatch(userDelete(id));
  };

  const downloadMultipleFiles = ({ link, quotation }) => {
    const fileUrls = [link];
    if (quotation) fileUrls.push(quotation);

    fileUrls.forEach((url) => {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          FileSaver.saveAs(blob, url.split("/").pop());
        })
        .catch((error) => console.log(error));
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, role, password }));
  };

  const handleGenerate = (id) => {
    dispatch(generateReport(id));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(allReports(search));
  };

  const handleMailForm = (id, emails) => {
    dispatch(mailForm({ id, emails }));
    setShow("Email Data");
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
    setForm({ template: "", report: "", doc: "", services: "" });
  };

  const addService = async (e) => {
    e.preventDefault();

    await dispatch(addAdminValues({ services: form.services }));
    toast.success("Service Added");
    setForm({ template: "", report: "", doc: "", services: "" });
  };

  const handleFile = (id, file, name) => {
    const form = new FormData();

    if (name === "Upload Report") form.append("file", file);
    else if (name === "Upload Quotation") form.append("quotation", file);

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
            className="btn btn-dark"
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
            Email Data
          </button>
        </div>
        <div className="col-2">
          <button
            className="btn btn-dark"
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
        {show === "Email Data" && (
          <>
            {mailId.length > 0 && (
              <div className="row">
                <h6 className="col-12">To - {emailList.toString()}</h6>
                <div className="col-6">
                  <InputRow
                    label="Add Email Id:"
                    type="email"
                    value={form.template}
                    handleChange={(e) =>
                      setForm({ ...form, template: e.target.value })
                    }
                  />
                </div>
                <div className="col-1">
                  <button
                    className="btn btn-success mt-1"
                    onClick={handleSendMail}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
            <EmailTable user={user} data={emailData} />
          </>
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
            <ReportStats data={reportsStats} />
            <Table
              user={user}
              th1="Report Name"
              th2="Report By"
              th3="Inspection Date"
              th4="Actions"
              data={reports}
              handleDownload={downloadMultipleFiles}
              handleButton={handleMailForm}
              handleFile={handleFile}
              handleGenerate={handleGenerate}
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
          <>
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
                  className=" btn btn-success"
                  disabled={form.doc ? false : true}
                  type="submit"
                >
                  {adminLoading ? "Adding..." : "Add Template"}
                </button>
              </div>
            </form>
            <hr className="my-3" />
            <form action="submit" className="row" onSubmit={addService}>
              <div className="col-5">
                <InputRow
                  label="Service Name"
                  type="text"
                  value={form.services}
                  placeholder="Service Name"
                  handleChange={(e) =>
                    setForm({ ...form, services: e.target.value })
                  }
                />
              </div>

              <div className="col-2" style={{ marginTop: 5 }}>
                <button
                  className=" btn btn-primary"
                  disabled={form.services ? false : true}
                  type="submit"
                >
                  {adminLoading ? "Adding..." : "Add Service"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
