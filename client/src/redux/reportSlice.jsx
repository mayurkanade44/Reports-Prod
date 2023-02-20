import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { authFetch } from "./auth";

const initialState = {
  reportLoading: false,
  contract: null,
  reportName: "",
  templateType: "",
  reportType: "",
  meetTo: "",
  meetContact: "",
  meetEmail: "",
  shownTo: "",
  shownContact: "",
  shownEmail: "",
  inspectionDate: "",
  image1: null,
  image2: null,
  details: [],
  reports: [],
  search: "",
  reportsStats: [],
  directReport: false,
  mailId: "",
  emailList: [],
  totalPages: 1,
  page: 1,
};

export const createReport = createAsyncThunk(
  "report/create",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/report/create", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "report/imgUpload",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/report/uploadImage", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const editReport = createAsyncThunk(
  "report/edit",
  async ({ id, form }, thunkAPI) => {
    try {
      const res = await authFetch.patch(`/report/editReport/${id}`, form);
      thunkAPI.dispatch(allReports(""));
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const allReports = createAsyncThunk(
  "report/all",
  async (search, thunkAPI) => {
    try {
      let url = `/report/allReports?page=${thunkAPI.getState().report.page}`;
      if (search) url += `&search=${search}`;
      const res = await authFetch.get(url);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const sendEmail = createAsyncThunk(
  "report/verify",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post(`/report/sendEmail`, form);
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const contractDetails = createAsyncThunk(
  "report/contractDetails",
  async (search, thunkAPI) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_CQR}/api/contractDetails?search=${search}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    addPage: (state, { payload: { formValue } }) => {
      state.details.push(formValue);
      state.image1 = null;
      state.image2 = null;
      toast.success("Page Added", { autoClose: 1000 });
    },
    reportHandleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    directUpload: (state) => {
      state.directReport = true;
      state.templateType = "Direct";
      state.reportType = "Direct";
      state.meetTo = "Direct";
      state.shownTo = "Direct";
    },
    mailForm: (state, { payload: { id, emails } }) => {
      state.mailId = id;
      state.emailList = emails;
    },
    changePage: (state, { payload }) => {
      state.page = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReport.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(createReport.fulfilled, (state, { payload }) => {
        toast.success(payload.msg, { autoClose: 1000 });
        return { ...state, ...initialState };
      })
      .addCase(createReport.rejected, (state, { payload }) => {
        state.reportLoading = false;
        console.log(payload);
      })
      .addCase(uploadImage.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(uploadImage.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        if (payload.imageCount === "image1") state.image1 = payload.link;
        else if (payload.imageCount === "image2") state.image2 = payload.link;
      })
      .addCase(uploadImage.rejected, (state, { payload }) => {
        state.reportLoading = false;
        console.log(payload);
      })
      .addCase(allReports.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(allReports.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        state.reports = payload.reports;
        state.reportsStats = payload.stats;
        state.totalPages = payload.totalPages;
      })
      .addCase(allReports.rejected, (state, { payload }) => {
        state.reportLoading = false;
        console.log(payload);
      })
      .addCase(sendEmail.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(sendEmail.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        toast.success(payload.msg);
      })
      .addCase(sendEmail.rejected, (state, { payload }) => {
        state.reportLoading = false;
        console.log(payload);
      })
      .addCase(contractDetails.pending, (state) => {
        state.reportLoading = true;
        state.contract = null;
      })
      .addCase(contractDetails.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        state.contract = payload.details;
      })
      .addCase(contractDetails.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      })
      .addCase(editReport.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(editReport.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        toast.success(payload.msg);
      })
      .addCase(editReport.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      });
  },
});

export const {
  addPage,
  reportHandleChange,
  directUpload,
  mailForm,
  changePage,
} = reportSlice.actions;

export default reportSlice.reducer;