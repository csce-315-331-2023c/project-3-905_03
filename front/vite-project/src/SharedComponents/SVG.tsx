import { ReactComponent as YourSvg } from './your-svg-file.svg';

const YourComponent: React.FC = () => {
    // Define the click handler
    const handleClick = () => {
        console.log('SVG clicked');
        // Your click handling logic here
    };

    // Render the SVG with the onClick handler
    return (
        <div>
            <YourSvg onClick={handleClick} />
        </div>
    );
};

export default YourComponent;