document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('currentAnalysis'));

    if (!data) {
        alert("No analysis data found. Redirecting to input.");
        window.location.href = 'analyze.html';
        return;
    }
    const setText = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    };
    setText('h2.text-2xl', `Analysis Report`);
    const descSpan = document.querySelector('p.max-w-2xl span');
    if (descSpan) descSpan.textContent = data.description || `Sequence #${data.id}`;
    const tableRows = document.querySelectorAll('table tbody tr');
    if (tableRows.length >= 4) {
        tableRows[0].querySelectorAll('td')[1].textContent = `#${data.id}`;
        tableRows[1].querySelectorAll('td')[1].textContent = new Date(data.created_at).toLocaleString();
        tableRows[2].querySelectorAll('td')[1].textContent = `${data.length.toLocaleString()} bp`;
        tableRows[3].querySelectorAll('td')[1].textContent = `${data.gc_content}%`;
    }
    const lengthCardValue = document.querySelector('.grid > div:nth-child(1) p.text-3xl');
    if (lengthCardValue) lengthCardValue.innerHTML = `${data.length.toLocaleString()} <span class="text-lg font-normal text-gray-500">bp</span>`;
    const gcCardValue = document.querySelector('.grid > div:nth-child(2) span.text-3xl');
    if (gcCardValue) gcCardValue.textContent = `${data.gc_content}%`;
    const gcBar = document.querySelector('.grid > div:nth-child(2) .h-full.rounded-full');
    if (gcBar) gcBar.style.width = `${data.gc_content}%`;
    const originalPre = document.querySelectorAll('pre')[0];
    if (originalPre) originalPre.innerHTML = formatSequence(data.sequence);
    const reversePre = document.querySelectorAll('pre')[1];
    if (reversePre) reversePre.innerHTML = formatSequence(data.reverse_complement);
    const exportBtn = document.querySelector('button.bg-primary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Description,Length,GC Content,Created At,Sequence,Reverse Complement\n"
                + `${data.id},"${data.description}",${data.length},${data.gc_content},"${data.created_at}","${data.sequence}","${data.reverse_complement}"`;
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `helixlabs_analysis_${data.id}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
function formatSequence(seq) {
    if (!seq) return "";
    const spaced = seq.replace(/(.{10})/g, '$1 ').trim();
    let formatted = "";
    let count = 1;
    for (let i = 0; i < spaced.length; i += 66) {
        formatted += `<span class="text-blue-600 font-bold select-none mr-4">${count}</span>${spaced.slice(i, i + 66)}\n`;
        count += 60;
    }
    return formatted; 
}