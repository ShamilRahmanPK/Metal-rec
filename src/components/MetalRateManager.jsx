import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import metals from "../data/metals";
import { ToastContainer } from "react-toastify";

import { toast } from "react-toastify";
import {
  getAllMetalRatesApi,
  getPuritiesByMetalApi,
  saveMetalRateApi,
} from "../services/allApi";

function MetalRateManager() {
  const [userInput, setUserInput] = useState({
    metalname: "",
    purity: "",
    rate: "",
    date: dayjs(),
  });
  console.log(userInput);

  const [data, setData] = useState([]);
  const [latestInfo, setLatestInfo] = useState(null);
  const [searchMetal, setSearchMetal] = useState("");
  const [searchPurity, setSearchPurity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formattedDate = dayjs("2025-08-02T10:25:50.298Z").format("DD-MM-YYYY");

  const [purityOptions, setPurityOptions] = useState([]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      userInput.metalname &&
      userInput.purity &&
      userInput.rate &&
      userInput.date
    ) {
      // API call to save metal rate
      try {
        const result = await saveMetalRateApi(userInput);
        if (result.status === 200) {
          toast.success("Metal rate saved successfully");
          setUserInput({ metalname: "", purity: "", rate: "", date: dayjs() });
          getAllPurities();
        } else {
          toast.error("Metal rate already exists for this date");
        }
      } catch (err) {
        console.error("Error saving metal rate:", err);
      }
    } else {
      toast.warning("Please fill all fields");
    }
  };

  useEffect(() => {
    const fetchPurityOptions = async () => {
      if (userInput.metalname) {
        try {
          const response = await getPuritiesByMetalApi(userInput.metalname);
          if (response.status === 200) {
            setPurityOptions(response.data);
          } else {
            setPurityOptions([]);
          }
        } catch (error) {
          console.error("Failed to fetch purity options", error);
          setPurityOptions([]);
        }
      } else {
        setPurityOptions([]);
      }
    };

    fetchPurityOptions();
    getAllMetalRates();
  }, [userInput.metalname]);

  const filteredData = data.filter(
    (row) =>
      row.metalname.toLowerCase().includes(searchMetal.toLowerCase()) &&
      row.purity.toLowerCase().includes(searchPurity.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAllMetalRates = async () => {
    try {
      const result = await getAllMetalRatesApi();
      if (result.status === 200) {
        setData(result.data);
        const metalRates = result.data
          .filter((entry) => entry.metalname === userInput.metalname)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (metalRates.length > 0) {
          const latest = metalRates[0];
          setLatestInfo({
            rate: latest.rate,
            date: dayjs(latest.date).format("DD-MM-YYYY"),
          });
        } else {
          setLatestInfo(null);
        }
      } else {
        console.error("Error fetching purities:", result.data);
        toast.error("Failed to fetch purities");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#1C1A33] p-6 rounded">
      <h1 className="text-lg font-medium mb-4">Metal Rate Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metal Selector */}
        <div>
          <p className="mb-1">Metal</p>
          <Autocomplete
            disablePortal
            options={metals}
            value={userInput.metalname}
            onChange={(e, newValue) =>
              setUserInput((prev) => ({ ...prev, metalname: newValue }))
            }
            sx={{
              backgroundColor: "#1C1A33",
              "& .MuiInputBase-root": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#FFD369" },
            }}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: "#1C1A33",
                  "& .MuiAutocomplete-option:hover": {
                    backgroundColor: "#2B2743",
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Metal"
                InputLabelProps={{ style: { color: "#FFD369" } }}
              />
            )}
          />
        </div>

        {/* Rate Input */}
        <div>
          <p className="mb-1">Rate</p>
          <TextField
            label="Input Rate"
            variant="outlined"
            autoComplete="off"
            fullWidth
            value={userInput.rate}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, rate: e.target.value }))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD369" },
                "&:hover fieldset": { borderColor: "#F7F7F7" },
                "&.Mui-focused fieldset": { borderColor: "#FFD369" },
                "& input": { color: "#FFFFFF", backgroundColor: "#1C1A33" },
              },
              "& .MuiInputLabel-root": { color: "#FFD369" },
            }}
            InputLabelProps={{ style: { color: "#FFD369" } }}
          />
        </div>

        {/* Date Picker */}
        <div>
          {latestInfo && (
            <p className="mb-1">
              Latest Rate:{" "}
              <span className="text-yellow-400">{latestInfo.rate}</span> at{" "}
              <span className="text-yellow-400">{latestInfo.date}</span>
            </p>
          )}

          <p className="mb-1">Date</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["MobileDatePicker"]}>
              <MobileDatePicker
                label="Rate Date"
                value={userInput.date}
                onChange={(newDate) =>
                  setUserInput((prev) => ({ ...prev, date: newDate }))
                }
                slotProps={{
                  textField: {
                    sx: {
                      backgroundColor: "#1C1A33",
                      input: { color: "#fff" },
                      "& label": { color: "#FFD369" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#FFD369" },
                        "&:hover fieldset": { borderColor: "#FFD369" },
                        "&.Mui-focused fieldset": { borderColor: "#FFD369" },
                      },
                      "& .MuiSvgIcon-root": { color: "#FFD369" },
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-72">
            <Autocomplete
              disablePortal
              options={purityOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.purity || ""
              }
              value={userInput.purity}
              onChange={(e, newValue) =>
                setUserInput((prev) => ({
                  ...prev,
                  purity:
                    typeof newValue === "string"
                      ? newValue
                      : newValue?.purity || "",
                }))
              }
              sx={{
                backgroundColor: "#1C1A33",
                "& .MuiInputBase-root": {
                  color: "#fff",
                  height: "56px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD369",
                },
              }}
              componentsProps={{
                paper: {
                  sx: {
                    backgroundColor: "#1C1A33",
                    "& .MuiAutocomplete-option:hover": {
                      backgroundColor: "#2B2743",
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Purity"
                  InputLabelProps={{ style: { color: "#FFD369" } }}
                />
              )}
            />
          </div>

          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#FFD369",
              color: "#1C1A33",
              "&:hover": { backgroundColor: "#FFC947" },
              paddingX: "24px",
            }}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 mt-5 text-white min-h-screen bg-[#18162e]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4 text-[#FFD369]">
            Metal Rate Manager
          </h2>

          {/* Search Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <TextField
              label="Search Metal"
              variant="outlined"
              value={searchMetal}
              onChange={(e) => {
                setSearchMetal(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                input: { color: "#fff" },
                label: { color: "#FFD369" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FFD369" },
                  "&:hover fieldset": { borderColor: "#FFD369" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD369" },
                },
              }}
              InputLabelProps={{ style: { color: "#FFD369" } }}
            />
            <TextField
              label="Search Purity"
              variant="outlined"
              value={searchPurity}
              onChange={(e) => {
                setSearchPurity(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                input: { color: "#fff" },
                label: { color: "#FFD369" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FFD369" },
                  "&:hover fieldset": { borderColor: "#FFD369" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD369" },
                },
              }}
              InputLabelProps={{ style: { color: "#FFD369" } }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-[#2E294E] text-[#FFD369]">
              <tr>
                <th className="px-4 py-3 text-left">Metal</th>
                <th className="px-4 py-3 text-left">Purity</th>
                <th className="px-4 py-3 text-left">Rate</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0 ? "bg-[#1C1A33]" : "bg-[#242040]"
                    }
                  >
                    <td className="px-4 py-2">{row.metalname}</td>
                    <td className="px-4 py-2">{row.purity}</td>
                    <td className="px-4 py-2">{row.rate}</td>
                    <td className="px-4 py-2">
                      {dayjs(row.date).format("DD-MM-YYYY")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-white">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            sx={{ borderColor: "#FFD369", color: "#FFD369" }}
          >
            Prev
          </Button>

          <span className="text-[#FFD369] font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>

          <Button
            variant="outlined"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            sx={{ borderColor: "#FFD369", color: "#FFD369" }}
          >
            Next
          </Button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default MetalRateManager;
