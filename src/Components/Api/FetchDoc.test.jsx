import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FetchDoc from './FetchDoc'; // Adjust this path if needed

// Mock fetch and useNavigate
const mockFetch = jest.fn();
const mockNavigate = jest.fn();

// Mock the browser's fetch function globally
global.fetch = mockFetch;

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('FetchDoc component', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockNavigate.mockClear();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays document data', async () => {
        const mockData = { success: true, data: { title: 'Test Title', content: 'Test Content' } };
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockData),
        });

        render(
            <MemoryRouter initialEntries={['/docs/1']}>
                <Routes>
                    <Route path="/docs/:id" element={<FetchDoc />} />
                </Routes>
            </MemoryRouter>
        );

        const titleInput = await screen.findByDisplayValue('Test Title');
        const contentInput = await screen.findByDisplayValue('Test Content');

        expect(titleInput).toBeInTheDocument();
        expect(contentInput).toBeInTheDocument();
    });

    test('handles form submission and navigates', async () => {
        const mockData = { success: true, data: { title: 'Test Title', content: 'Test Content' } };
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockData),
        });

        render(
            <MemoryRouter initialEntries={['/docs/1']}>
                <Routes>
                    <Route path="/docs/:id" element={<FetchDoc />} />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByDisplayValue('Test Title');

        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ success: true }),
        });

        // Simulate form submission
        const submitButton = screen.getByText('Apply Changes');

        // Use fireEvent for a more explicit event handling
        fireEvent.click(submitButton);

        // Wait for the navigation to complete
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
