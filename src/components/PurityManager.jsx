import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import metals from "../data/metals";
import { toast } from "react-toastify";
import {
  deletePurityApi,
  getAllPuritiesApi,
  savePurity,
} from "../services/allApi";

function PurityManager() {
  const [userInput, setUserInput] = useState({ metalname: "", purity: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    getAllPurities();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (userInput.metalname && userInput.purity) {
      setLoading(true); // <-- start spinner
      try {
        const result = await savePurity(userInput);
        if (result.status == 200) {
          toast.success("Purity saved successfully");
          setUserInput({ metalname: "", purity: "" });
          getAllPurities();
        } else if (result.status == 406) {
          toast.warning("Purity already exists");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error saving purity");
      } finally {
        setLoading(false); // <-- stop spinner
      }
    } else {
      toast.error("Please select a metalname and enter purity value");
    }
  };

  const getAllPurities = async () => {
    try {
      const result = await getAllPuritiesApi();
      if (result.status == 200) {
        setData(result.data);
      } else {
        console.log("Error fetching purities:", result.data);
        alert("Failed to fetch purities");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (id) {
        const res = await deletePurityApi(id);
        if (res.status === 200) {
          toast.info("Purity deleted successfully");
          getAllPurities();
        } else {
          toast.error("Failed to delete purity");
        }
      } else {
        toast.error("Error in deleting purity: Invalid ID");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <div className="bg-[#1C1A33] p-4 rounded mb-6">
      <h1 className="font-medium">Purity Management</h1>
      <div className="flex flex-wrap gap-4 mt-4 items-end">
        <div className="w-full md:w-1/3">
          <p className="block pb-1">Metal</p>
          <Autocomplete
            disablePortal
            options={metals}
            value={userInput.metalname}
            onChange={(e, newValue) =>
              setUserInput((prev) => ({ ...prev, metalname: newValue }))
            }
            sx={{
              width: 300,
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

        <div>
          <p className="block pb-1">Purity</p>
          <TextField
            label="Input Purity"
            variant="outlined"
            autoComplete="off"
            value={userInput.purity}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, purity: e.target.value }))
            }
            className="w-[300px] bg-[#1C1A33]"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FFD369" },
                "&:hover fieldset": { borderColor: "#F7F7F7" },
                "&.Mui-focused fieldset": { borderColor: "#FFD369" },
                "& input": { color: "#FFFFFF", backgroundColor: "#1C1A33" },
              },
              "& .MuiInputLabel-root": { color: "#FFD369" },
              "&.Mui-focused .MuiInputLabel-root": { color: "#FFD369" },
            }}
            InputLabelProps={{ style: { color: "#FFD369" } }}
          />
        </div>

        <div>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading} 
            sx={{
              backgroundColor: "#FFD369",
              color: "#1C1A33",
              "&:hover": { backgroundColor: "#FFC947" },
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: "100px",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-[#2B2743] text-white text-sm text-left">
          <thead>
            <tr className="bg-[#11101d]">
              <th className="px-4 py-2">Metal</th>
              <th className="px-4 py-2">Purity</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-[#1C1A33]" : "bg-[#242040]"}
              >
                <td className="px-4 py-2">{row.metalname}</td>
                <td className="px-4 py-2">{row.purity}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(row._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-sm rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default PurityManager;
