import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "./auth";

const initialState = {
  adminLoading: false,
  findings: [],
  suggestions: [],
  templates: [],
  emailData: [],
};

export const getAdminValues = createAsyncThunk(
  "admin/getValues",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/admin/values");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const addAdminValues = createAsyncThunk(
  "admin/addValues",
  async (value, thunkAPI) => {
    try {
      const res = await authFetch.post("/admin/values", value);
      thunkAPI.dispatch(getAdminValues());
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminValues.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(getAdminValues.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.findings = payload.findings;
        state.suggestions = payload.suggestions;
        state.templates = payload.templates;
        state.emailData = payload.emailData;
      })
      .addCase(addAdminValues.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(addAdminValues.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        toast.success(payload.msg);
      })
      .addCase(addAdminValues.rejected, (state) => {
        state.adminLoading = false;
      });
  },
});

export default adminSlice.reducer;
