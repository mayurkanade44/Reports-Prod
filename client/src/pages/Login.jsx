import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputRow } from "../components";
import { handleUserChange, login } from "../redux/userSlice";

const Login = () => {
  const { userLoading, email, password, user } = useSelector(
    (store) => store.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (user) {
      if (user.role === "Operator")
        setTimeout(() => {
          navigate("/create");
        }, 500);
      else
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
    }

    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row d-flex flex-column page mx-2 justify-content-center align-items-center">
          <div className="col-md-4">
            <InputRow
              label="Email:"
              type="email"
              name="email"
              value={email}
              handleChange={(e) => {
                dispatch(
                  handleUserChange({
                    name: e.target.name,
                    value: e.target.value,
                  })
                );
              }}
            />
          </div>
          <div className="col-md-4">
            <InputRow
              label="Password:"
              type="password"
              name="password"
              value={password}
              handleChange={(e) => {
                dispatch(
                  handleUserChange({
                    name: e.target.name,
                    value: e.target.value,
                  })
                );
              }}
            />
          </div>
          <div className="col-md-4 mt-2">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={userLoading ? true : false}
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Login;
