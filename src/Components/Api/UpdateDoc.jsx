function updateEntry(id = "null", updatedData) {
    fetch(`/api/entries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Entry updated:', data);
      })
      .catch((error) => console.error('Error updating entry:', error));
}
