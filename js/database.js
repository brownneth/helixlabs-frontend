document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('tbody');
    const countDisplay = document.querySelector('p.text-xs.font-mono');
    const searchInput = document.getElementById('search-input');
    loadData();
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                loadData(query);
            }
        });
    }
    async function loadData(query = "") {
        tableBody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Loading records...</td></tr>`;
        
        try {
            let url;
            if (query) {
                url = `${API_BASE_URL}/sequences/search?q=${encodeURIComponent(query)}`;
            } else {
                url = `${API_BASE_URL}/sequences/me`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await response.json();

            if (response.ok) {
                let rows = [];
                if (Array.isArray(result)) {
                    rows = result;
                } else if (result.data) {
                    rows = result.data;
                }

                if (rows.length > 0) {
                    renderTable(rows);
                } else {
                    tableBody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No records found matching your search.</td></tr>`;
                    countDisplay.textContent = "0 Records found";
                }
            } else {
                tableBody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error: ${result.message || "Failed to fetch"}</td></tr>`;
            }
        } catch (error) {
            console.error("Database Error:", error);
            tableBody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Failed to load data. Check console.</td></tr>`;
        }
    }

    function renderTable(rows) {
        countDisplay.textContent = `${rows.length} Records found`;

        tableBody.innerHTML = rows.map(row => `
            <tr class="even:bg-slate-50 hover:bg-blue-50/50 transition-colors">
                <td class="px-4 py-3 font-mono text-xs font-medium text-slate-900 border-r border-slate-200">
                    #${row.id}
                </td>
                <td class="px-4 py-3 border-r border-slate-200">
                    <div class="flex flex-col">
                        <span class="font-semibold text-slate-900">${row.description || 'No Description'}</span>
                        <span class="text-xs text-slate-500 truncate max-w-[300px]">${row.sequence.substring(0, 30)}...</span>
                    </div>
                </td>
                <td class="px-4 py-3 font-mono text-xs border-r border-slate-200">
                    <span class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${row.length.toLocaleString()} bp</span>
                </td>
                <td class="px-4 py-3 font-mono text-xs border-r border-slate-200">
                    <span class="text-slate-600">${row.gc_content}%</span>
                </td>
                <td class="px-4 py-3 font-mono text-xs text-slate-500 border-r border-slate-200">
                    ${new Date(row.created_at).toLocaleDateString()}
                </td>
                <td class="px-4 py-3 text-right">
                    <button onclick="window.viewAnalysis(${row.id}, '${row.sequence}', '${row.description || ''}', ${row.length}, ${row.gc_content}, '${row.reverse_complement}', '${row.created_at}')" class="text-slate-400 hover:text-primary transition-colors" title="View Report">
                        <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }
});

window.viewAnalysis = (id, sequence, description, length, gc_content, reverse_complement, created_at) => {
    const data = { id, sequence, description, length, gc_content, reverse_complement, created_at };
    localStorage.setItem('currentAnalysis', JSON.stringify(data));
    window.location.href = 'results.html';
};