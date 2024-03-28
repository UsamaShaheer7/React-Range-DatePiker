import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { IoMdCalendar } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object({
  Start_Date: Yup.date()
    .required("Start date is required")
    .test(
      "is-before-end",
      "Start date must be before end date",
      function (value) {
        const endDate = this.parent.End_Date;
        return !endDate || new Date(value) < new Date(endDate);
      }
    ),
  End_Date: Yup.date()
    .required("End date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const startDate = this.parent.Start_Date;
        return !startDate || new Date(value) > new Date(startDate);
      }
    ),
});

const App = () => {
  const currentDate = new Date();
  const formik = useFormik({
    initialValues: {
      Start_Date: "",
      End_Date: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formattedValues = {
        Start_Date: values.Start_Date.toISOString().slice(0, 10),
        End_Date: values.End_Date.toISOString().slice(0, 10),
      };

      console.log("Form submitted with values:", formattedValues);
      resetForm();
    },
  });

  const openStartDatePicker = () => {
    formik.setFieldTouched("Start_Date", true, false);
    formik.setFieldError("Start_Date", null);
    document.getElementById("startDatePicker").focus();
  };

  const openEndDatePicker = () => {
    formik.setFieldTouched("End_Date", true, false);
    formik.setFieldError("End_Date", null);
    document.getElementById("endDatePicker").focus();
  };

  useEffect(() => {
    formik.setFieldValue("Start_Date", new Date("2021-12-03"));
    formik.setFieldValue("End_Date",  new Date("2021-12-02"));
  }, []);

  return (
    <form onSubmit={formik.handleSubmit} className="h-[100vh] bg-slate-200">
      <div className="flex">
        <div>
          <label className="text-[#808080] outline-none text-[14px]">
            Start Date
          </label>
          <div className="flex bg-white justify-between items-center w-[300px] h-[50px] rounded-md">
            <DatePicker
              id="startDatePicker"
              className="ml-[20px] focus:outline-none"
              selected={formik.values.Start_Date}
              onChange={(date) => formik.setFieldValue("Start_Date", date)}
              onBlur={formik.handleBlur("Start_Date")}
              selectsStart
              startDate={formik.values.startDate}
              endDate={formik.values.End_Date}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              minDate={currentDate}
            />
            <div
              className="flex items-center mr-[10px]"
              onClick={openStartDatePicker}
            >
              <IoMdCalendar className="w-[25px] h-[25px] text-redish mr-[15px]" />
            </div>
          </div>
          {formik.touched.Start_Date && formik.errors.Start_Date ? (
            <div className="text-redish text-xs">
              {formik.errors.Start_Date}
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-[#808080] outline-none text-[14px]">
            End Date
          </label>
          <div className="flex bg-white justify-between items-center w-[300px] h-[50px] rounded-md">
            <DatePicker
              id="endDatePicker"
              className="ml-[20px] focus:outline-none"
              selected={formik.values.End_Date}
              onChange={(date) => formik.setFieldValue("End_Date", date)}
              onBlur={formik.handleBlur("End_Date")}
              selectsEnd
              startDate={formik.values.Start_Date}
              endDate={formik.values.End_Date}
              minDate={new Date(formik.values.Start_Date).setDate(new Date(formik.values.Start_Date).getDate() + 1)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
            />
            <div
              className="flex items-center mr-[10px]"
              onClick={openEndDatePicker}
            >
              <IoMdCalendar className="w-[25px] h-[25px] text-redish mr-[15px]" />
            </div>
          </div>
          {formik.touched.End_Date && formik.errors.End_Date ? (
            <div className="text-redish text-xs">
              {formik.errors.End_Date}
            </div>
          ) : null}
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
