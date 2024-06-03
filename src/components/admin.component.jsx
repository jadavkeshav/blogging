import { useContext } from "react";
import darkLogo from "../imgs/logo-dark.png";
import lightLogo from "../imgs/logo-light.png";
import { ThemeContext } from "../App";

const AdminDash = () => {
    const { theme } = useContext(ThemeContext);

    // Define background gradients for light and dark themes with colorful variations
    const lightGradient = `linear-gradient(to right, #ffd54f, #ff8a65)`;
    const darkGradient = `linear-gradient(to right, #4db6ac, #1976d2)`;

    // Define transition for smooth theme change
    const transition = "background-color 0.3s ease";

    return (
        <div className="flex justify-center items-center text-center" style={{ minHeight: "82vh", background: theme === "light" ? lightGradient : darkGradient, transition }}>
            <img src={theme === "light" ? darkLogo : lightLogo} alt="logo" className="w-[60vh] h-[20vh]" />
        </div>
    );
};

export default AdminDash;
