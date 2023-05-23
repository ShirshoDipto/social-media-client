import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ErrorComponent({ error, handleErrorClose }) {
  return (
    <div className="errorMsg">
      <Snackbar
        message={error.msg}
        open={error.open}
        onClose={handleErrorClose}
        autoHideDuration={3000}
      >
        <Alert
          severity="error"
          onClose={handleErrorClose}
          sx={{ width: "100%" }}
        >
          {error.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
