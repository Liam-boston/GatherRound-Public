import { fireEvent, render } from '@testing-library/react';
import UserProfileModal from '../UserProfileModal';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react';

const mockUser = {
    name: 'John Smith',
    email: 'test@mail.com'
};

test('should render modal', () => {
    const {getByTestId} = render(<UserProfileModal show={true} onClose={console.log('close')} userData={mockUser} />);

    expect(getByTestId('modal')).toBeInTheDocument();
});

test('should render user data', () => {
    const component = render(<UserProfileModal show={true} onClose={console.log('close')} userData={mockUser} />);

    const name = component.getByTestId('name');
    const email = component.getByTestId('email');

    expect(name.textContent).toBe('Name: John Smith');
    expect(email.textContent).toBe('Email: test@mail.com ');
}); 

test('should log out', () => {
    let message = '';
    const {getByTestId} = render(<UserProfileModal show={true} logOut={() => {message='logOut success'}} userData={mockUser} />);

    act(() => {
        fireEvent.click(getByTestId('logOut'));
    });

    expect(message).toBe('logOut success')
});

test('should close', () => {
    const {getByTestId} = render(<UserProfileModal show={true} logOut={()=>{}} userData={mockUser} />);

    act(() => {
        fireEvent.click(getByTestId('close'));
    })

    expect(getByTestId(modal)).not.toBeInTheDocument();   
});