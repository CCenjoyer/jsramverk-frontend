const { expect } = require('chai');
const { render, fireEvent, screen, waitFor } = require('@testing-library/react');
const CreateDoc = require('../src/Components/Api/CreateDoc.jsx');
const { BrowserRouter } = require('react-router-dom');
const sinon = require('sinon');
const { useNavigate } = require('react-router-dom');

describe('CreateDoc Component', () => {
    let fetchMock, navigateMock;

    beforeEach(() => {
        // Mock fetch to avoid actual network calls
        fetchMock = sinon.stub(global, 'fetch');
        fetchMock.resolves({
            json: () => Promise.resolve({ success: true })
        });

        // Mock useNavigate
        navigateMock = sinon.stub();
        sinon.replace(require('react-router-dom'), 'useNavigate', () => navigateMock);

        // Render the component inside a Router since it uses `useNavigate`
        render(
            <BrowserRouter>
                <CreateDoc />
            </BrowserRouter>
        );
    });

    afterEach(() => {
        // Restore fetch mock and other mocks
        sinon.restore();
    });

    it('should create a document with form input', async () => {
        // Find the form elements
        const titleInput = screen.getByLabelText('Title:');
        fireEvent.change(titleInput, { target: { value: 'Test Title' } });
        
        const contentInput = screen.getByLabelText('Content:');
        fireEvent.change(contentInput, { target: { value: 'Test Content' } });

        const submitButton = screen.getByText('Create Document');

        // Submit the form
        fireEvent.click(submitButton);

        // Check that fetch was called with correct arguments
        expect(fetchMock.calledOnce).to.be.true;
        expect(fetchMock.firstCall.args[1].body).to.equal(JSON.stringify({
            title: 'Test Title',
            content: 'Test Content'
        }));

        // Wait for navigate to be called after the response
        await waitFor(() => {
            expect(navigateMock.calledOnce).to.be.true;
        });
    });
});
