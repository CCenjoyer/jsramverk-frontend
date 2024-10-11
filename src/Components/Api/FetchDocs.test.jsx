import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FetchDocs from './FetchDocs'; // Adjust this path if needed

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('FetchDocs component', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('displays loading state initially', () => {
        mockFetch.mockImplementationOnce(() => new Promise(() => {})); // Hang the fetch

        render(
            <MemoryRouter>
                <FetchDocs />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('fetches and displays document titles', async () => {
        const mockData = {
            success: true,
            data: [
                { _id: '1', title: 'Test Document 1' },
                { _id: '2', title: 'Test Document 2' }
            ]};
        mockFetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockData),
        });

        render(
            <MemoryRouter>
                <FetchDocs />
            </MemoryRouter>
        );

        // Wait for the documents to be displayed
        const link1 = await screen.findByText('Test Document 1');
        const link2 = await screen.findByText('Test Document 2');

        expect(link1).toBeInTheDocument();
        expect(link2).toBeInTheDocument();
    });
});
