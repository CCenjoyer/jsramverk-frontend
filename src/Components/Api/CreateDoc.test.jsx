import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateDoc from './CreateDoc';

const apiUrl = process.env.REACT_APP_API_LINK;
// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('CreateDoc Component', () => {
    // Mock the fetch global function
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true }),
            })
        );
        // Clear all instances and calls to fetch and navigate before each test
        jest.clearAllMocks();
    });


    test('renders form fields', () => {
        render(
            <Router>
                <CreateDoc />
            </Router>
        );
        // Check if title and content fields are present
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create document/i })).toBeInTheDocument();
    });


    test('updates input fields', () => {
        render(
            <Router>
                <CreateDoc />
            </Router>
        );
        // Simulate user typing in the title input
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Test Document' },
        });
        // Simulate user typing in the content input
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'This is a test document.' },
        });
        // Assert that the input fields have the correct values
        expect(screen.getByLabelText(/title/i).value).toBe('Test Document');
        expect(screen.getByLabelText(/content/i).value).toBe('This is a test document.');
    });


    test('submits the form and calls fetch', async () => {
        render(
            <Router>
                <CreateDoc />
            </Router>
        );
        // Fill in the input fields
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Test Document' },
        });
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'This is a test document.' },
        });
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /create document/i }));
        // Wait for the fetch to be called
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        // Check that fetch was called with the correct URL and body
        expect(fetch).toHaveBeenCalledWith(
            `${apiUrl}/docs`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Test Document',
                    content: 'This is a test document.',
                }),
            })
        );
        // Check if navigate was called after successful submission
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
