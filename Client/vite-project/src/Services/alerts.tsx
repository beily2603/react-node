import { toast } from 'react-toastify';

export const successAlert = (massege: string) => {
    console.log('success alert');
    toast.success(massege, {
        position: 'top-right', // Choose the position of the alert
        autoClose: 3000, // Time (in milliseconds) after which the alert will be automatically closed
        hideProgressBar: false, // Show or hide the progress bar
        closeOnClick: true, // Close the alert when clicked
        pauseOnHover: true, // Pause the timer when the mouse is hovered over the alert
        draggable: true, // Allow the alert to be draggable
        progress: undefined, // Use the default progress indicator
    });
};

export const errorAlert = (massege: string) => {
    toast.warn(massege, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const infoAlert = (massege: string) => {
    toast.error(massege, {
        position: 'top-right', // Choose the position of the alert
        autoClose: 3000, // Time (in milliseconds) after which the alert will be automatically closed
        hideProgressBar: false, // Show or hide the progress bar
        closeOnClick: true, // Close the alert when clicked
        pauseOnHover: true, // Pause the timer when the mouse is hovered over the alert
        draggable: true, // Allow the alert to be draggable
        progress: undefined, // Use the default progress indicator
    });
};