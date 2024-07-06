import { render } from "@testing-library/react";
import Homepage from '../Homepage';
import { BrowserRouter } from "react-router-dom";

// UT-9: Homepage contains home button
test('should contain button', () => {
    const { getByRole } = render(
        <BrowserRouter>
            <Homepage/>
        </BrowserRouter>
    );
    const button = getByRole('button', {hidden:true});
    expect(button).toBeInTheDocument();
});