import React from "react";
import "../Styles/Cashier.css";

const Cashier = () => {

    return (
        <div>
            <h1>Cashier</h1>
            <h2>Note 1:</h2>
            <p>
                If you want to keep the Manager and Cashier GUIs consistent with each other and you have not yet implemented the UI yet, u can just use
                - ManagerUI/Pages/Manager.tsx
                - ManagerUI/Components/ManagerNav.tsx
                - ManagerUI/Styles/Manager.css
                - ManagerUI/Styles/ManagerNav.css

                as a template for the Cashier UI
            </p>
            <br></br>
            <h2>Note 2:</h2>
            <p>
                Also feel free to modify anything, but lets try to keep it consistent.

                Gentle reminder:
                - src/styles/App.css
                - src/styles/index.css

                so if you want to change the font or something, you can do it there, and it will apply to all subpages
            </p>
        </div>
    );
};

export default Cashier;
