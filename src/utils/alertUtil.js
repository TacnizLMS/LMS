import Swal from "sweetalert2";

export const showSuccess = (msg) =>
  Swal.fire({ icon: "success", title: "Success", text: msg });

export const showError = (msg) =>
  Swal.fire({ icon: "error", title: "Error", text: msg });

export const showInfo = (msg) =>
  Swal.fire({ icon: "info", title: "Info", text: msg });

export const confirmDialog = async (text) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  return result.isConfirmed; // only true if user clicks "Yes"
};
