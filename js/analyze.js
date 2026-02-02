document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.querySelector('button.bg-primary');
    const sequenceInput = document.getElementById('dna-sequence');
    const descInput = document.getElementById('exp-desc');

    analyzeBtn.addEventListener('click', async () => {
        const sequence = sequenceInput.value.trim();
        const description = descInput.value.trim();
        if (!sequence) {
            alert("Please enter a DNA sequence.");
            return;
        }
        if (!/^[ATGC]+$/i.test(sequence)) {
            alert("Invalid DNA sequence. Only characters A, T, G, C are allowed.");
            return;
        }
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Analyzing...`;

        try {
            const response = await fetch(`${API_BASE_URL}/sequences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ sequence, description })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('currentAnalysis', JSON.stringify(result.data));
                window.location.href = 'results.html';
            } else {
                alert(result.message || "Analysis failed.");
            }
        } catch (error) {
            console.error("Analysis Error:", error);
            alert("Server connection failed.");
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = originalText;
        }
    });
});