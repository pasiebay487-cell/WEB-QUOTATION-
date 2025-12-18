document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENT SELECTORS ---
    const dateEl = document.getElementById("date");
    const timeEl = document.getElementById("time");
    const invoiceNumberEl = document.getElementById("invoiceNumber");
    const tableBody = document.querySelector("#quotationTable tbody");
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const finalAmountEl = document.getElementById("finalAmount");
    const balanceEl = document.getElementById("balance");
    const discountInput = document.getElementById("discountInput");
    const advanceInput = document.getElementById("advanceInput");
    const addItemBtn = document.getElementById("addItem");
    const printBtn = document.getElementById("printBtn");
    const newBtn = document.getElementById("newBtn");
    
    // Customer details elements
    const customerName = document.getElementById("customerName");
    const customerAddress = document.getElementById("customerAddress");
    const customerEmail = document.getElementById("customerEmail");
    const customerPhone = document.getElementById("customerPhone");
    const validUntil = document.getElementById("validUntil");
    const projectName = document.getElementById("projectName");
    const paymentTerms = document.getElementById("paymentTerms");

    // --- FUNCTIONS ---
    
    /**
     * Generates a default invoice number
     */
    function generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        return `INV-${year}${month}${day}-001`;
    }

    /**
     * Sets the current date and time in the document.
     */
    function setDateTime() {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString("en-CA"); // YYYY-MM-DD format
        timeEl.textContent = now.toLocaleTimeString("en-US", { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
    }

    /**
     * Sets default valid until date (30 days from now)
     */
    function setDefaultValidUntil() {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        validUntil.value = futureDate.toISOString().split('T')[0];
    }

    // Update date and time every second
    setInterval(setDateTime, 1000);
    

    /**
     * Updates all financial calculations based on table and input values.
     */
    function updateCalculations() {
        let subtotal = 0;
        tableBody.querySelectorAll("tr").forEach(row => {
            const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
            const price = parseFloat(row.querySelector(".price")?.value) || 0;
            const total = qty * price;
            row.querySelector(".total").textContent = total.toFixed(2);
            subtotal += total;
        });

        const discountPercent = parseFloat(discountInput.value) || 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const finalAmount = subtotal - discountAmount;
        const advanceAmount = parseFloat(advanceInput.value) || 0;
        const balance = finalAmount - advanceAmount;

        subtotalEl.textContent = subtotal.toFixed(2);
        discountEl.textContent = discountAmount.toFixed(2);
        finalAmountEl.textContent = finalAmount.toFixed(2);
        balanceEl.textContent = balance.toFixed(2);
    }

    /**
     * Adds a new item row to the quotation table.
     */
    function addItemRow() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" class="form-control form-control-sm desc" placeholder="Item Description"></td>
            <td><input type="number" class="form-control form-control-sm qty text-end" value="1" min="1"></td>
            <td><input type="number" class="form-control form-control-sm price text-end" value="0.00" min="0" step="0.01"></td>
            <td class="total text-end">0.00</td>
            <td class="action-column"><button class="btn btn-danger btn-sm remove">×</button></td>
        `;
        tableBody.appendChild(row);
        updateCalculations();
    }


    /**
     * Creates a new invoice
     */
    function newInvoice() {
        if (confirm('Are you sure you want to create a new invoice? Any unsaved changes will be lost.')) {
            invoiceNumberEl.value = generateInvoiceNumber();
            customerName.value = '';
            customerAddress.value = '';
            customerEmail.value = '';
            customerPhone.value = '';
            projectName.value = '';
            paymentTerms.value = 'Due on Receipt';
            discountInput.value = '10';
            advanceInput.value = '0';

            tableBody.innerHTML = '';
            addItemRow();

            setDefaultValidUntil();

            updateCalculations();
        }
    }

    // --- EVENT LISTENERS ---
    addItemBtn.addEventListener("click", addItemRow);

    tableBody.addEventListener("input", updateCalculations);

    tableBody.addEventListener("click", e => {
        if (e.target.classList.contains("remove")) {
            if (tableBody.children.length > 1) {
                e.target.closest("tr").remove();
                updateCalculations();
            } else {
                alert("At least one item is required!");
            }
        }
    });

    discountInput.addEventListener("input", updateCalculations);
    advanceInput.addEventListener("input", updateCalculations);

    // Button event listeners
    printBtn.addEventListener("click", () => {
        window.print();
    });

    newBtn.addEventListener("click", newInvoice);

    // --- INITIALIZATION ---
    setDateTime();
    invoiceNumberEl.value = generateInvoiceNumber();
    setDefaultValidUntil();
    addItemRow();
});