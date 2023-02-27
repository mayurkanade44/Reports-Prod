import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authFetch } from "./auth";
import { toast } from "react-toastify";
import { clearReport } from "./reportSlice";

const initialState = {
  userLoading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  allUsers: [],
  email: "",
  password: "",
  name: "",
  role: "",
};

export const register = createAsyncThunk(
  "user/register",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/user/register", form);
      thunkAPI.dispatch(clearValues());
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const login = createAsyncThunk("user/login", async (form, thunkAPI) => {
  try {
    const res = await authFetch.post("/user/login", form);
    thunkAPI.dispatch(clearValues());
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
});

export const getAllUsers = createAsyncThunk("user/all", async (_, thunkAPI) => {
  try {
    const res = await authFetch.get("/user/allUser");
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
});

export const userDelete = createAsyncThunk(
  "user/delete",
  async (id, thunkAPI) => {
    try {
      const res = await authFetch.delete(`/user/delete/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const clearStore = createAsyncThunk(
  "user/clearStore",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(logout());
      thunkAPI.dispatch(clearReport());
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleUserChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: (state) => {
      state.email = "";
      state.name = "";
      state.password = "";
      state.role = "";
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
        toast.success(payload.msg);
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload);
      })
      .addCase(login.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
        toast.success(payload.msg);
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload);
      })
      .addCase(getAllUsers.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
      })
      .addCase(userDelete.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(userDelete.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
        toast.success(payload.msg);
      })
      .addCase(userDelete.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload.msg);
      });
  },
});

export const { handleUserChange, clearValues, logout } = userSlice.actions;

export default userSlice.reducer;
