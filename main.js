let jsonData = [];

fetch("product.json")
    .then(response => response.json())
    
    .then(data => {
        jsonData = data;
        console.log("JSON 数据加载成功", jsonData);
        
    })
    .catch(error => console.error("加载 JSON 失败", error));

    document.addEventListener("DOMContentLoaded", function () {
        let categoryInput = document.getElementById("category-profile-input");
        let suggestionsContainer = document.getElementById("category-suggestions");
    
        let descriptionInput = document.getElementById("description-input");
        let descriptionSuggestions = document.getElementById("description-suggestions");
    
        categoryInput.addEventListener("input", function () {
            let inputValue = categoryInput.value.trim().toLowerCase();
            suggestionsContainer.innerHTML = ""; // 清空旧的建议
    
            if (!inputValue || jsonData.length === 0) {
                return;
            }
    
            // **匹配 category**
            let matchedCategories = [...new Set(jsonData
                .map(product => product.category)
                .filter(category => category.toLowerCase().includes(inputValue))
            )];
    
            if (matchedCategories.length > 0) {
                matchedCategories.forEach(category => {
                    let suggestionItem = document.createElement("div");
                    suggestionItem.classList.add("suggestion-item");
                    suggestionItem.textContent = category;
                    suggestionItem.addEventListener("click", function () {
                        categoryInput.value = category; // 选中后填充
                        suggestionsContainer.innerHTML = ""; // 选中后清空建议
                        updateDescriptionSuggestions(category); // **更新 Description 选项**
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                });
    
                suggestionsContainer.style.display = "block"; // 显示建议
            } else {
                suggestionsContainer.style.display = "none"; // 没有匹配时隐藏
            }
        });
    
        // **点击外部隐藏 category 建议**
        document.addEventListener("click", function (event) {
            if (event.target !== categoryInput) {
                suggestionsContainer.style.display = "none";
            }
        });
    
        // **更新 description 建议**
        function updateDescriptionSuggestions(selectedCategory) {
            descriptionSuggestions.innerHTML = ""; // 清空旧的建议
    
            let matchedProducts = jsonData
                .filter(product => product.category === selectedCategory)
                .map(product => product.name);
    
            if (matchedProducts.length > 0) {
                matchedProducts.forEach(name => {
                    let suggestionItem = document.createElement("div");
                    suggestionItem.classList.add("suggestion-item");
                    suggestionItem.textContent = name;
                    suggestionItem.addEventListener("click", function () {
                        descriptionInput.value = name; // 选中后填充
                        descriptionSuggestions.innerHTML = ""; // 选中后清空建议
                    });
                    descriptionSuggestions.appendChild(suggestionItem);
                });
    
                descriptionSuggestions.style.display = "block"; // 显示 Description 建议
            } else {
                descriptionSuggestions.style.display = "none"; // 没有匹配时隐藏
            }
        }
    
        // **监听 description-input，防止误触**
        descriptionInput.addEventListener("click", function () {
            if (descriptionSuggestions.innerHTML !== "") {
                descriptionSuggestions.style.display = "block";
            }
        });
    
        // **点击外部隐藏 description 建议**
        document.addEventListener("click", function (event) {
            if (event.target !== descriptionInput) {
                descriptionSuggestions.style.display = "none";
            }
        });
    });
    



document.addEventListener("DOMContentLoaded", function () {
    let filterOptions = document.getElementById("filter-options");
    let filterBtn = document.getElementById("filter-btn");
    filterOptions.style.display = "none";
    filterBtn.addEventListener("click", function () {
        filterOptions.style.display = (filterOptions.style.display === "none" || filterOptions.style.display === "") 
            ? "block" 
            : "none";
    });

document.getElementById("search").addEventListener("click", function() {
    let clientName = document.getElementById("client-input").value.trim(); 
    let displayElement = document.getElementById("client-name");

  
    displayElement.textContent = clientName ? `Client name: ${clientName}` : "Client name:";
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        let row = event.target.closest("tr");

        if (row) {
            let confirmDelete = confirm("Are you sure you want to delete this item?");
            if (confirmDelete) {
                row.remove();
                updatePrice(); // 重新计算价格
            }
        }
    }
});

document.getElementById("search").addEventListener("click", function () {
    let inputValue = document.getElementById("category-profile-input").value.trim();
    let descriptionInput = document.getElementById("description-input").value.trim().toLowerCase();
    let tbody = document.querySelector(".product-table tbody");

    let filteredData = [];

    if (!isNaN(inputValue)) {
        filteredData = jsonData.filter(product => product.profile_no.toString() === inputValue);
    } else {
        filteredData = jsonData.filter(product =>
            product.category.toLowerCase() === inputValue.toLowerCase() &&
            product.name.toLowerCase() === descriptionInput
        );
    }

    if (filteredData.length > 0) {
        filteredData.forEach(product => {
            let lengths = Array.isArray(product.length) ? product.length : [product.length];

            lengths.forEach(lengthValue => {
                let row = `
                    <tr>
                        <td>${product.category}</td>
                        <td>${product.profile_no}</td>
                        <td>${product.name}</td>
                        <td>${product.thk_mm}</td>
                        <td class="length-value">${lengthValue}</td>
                        <td>
                            <select class="colorSelect">
                                <option value="none">None</option>
                                <option value="EWH 11S. SM.WHITE 滑面白">EWH 11S. SM.WHITE 滑面白</option>
                                <option value="HBG 16T .MT BEIGE 粗面米色">HBG 16T .MT BEIGE 粗面米色</option>
                                <option value="EBR813T. MT BROWN. 粗面深褐色">EBR813T. MT BROWN. 粗面深褐色</option>
                                <option value="HBR 812T . MT LIGHT BROWN . 粗面浅褐色">HBR 812T . MT LIGHT BROWN . 粗面浅褐色</option>
                                <option value="FGR753T. MT GRENNISH GREY. 粗面灰带青">FGR753T. MT GRENNISH GREY. 粗面灰带青</option>
                                <option value="EGR 744T. MT LIGHT GREY. 粗面浅灰色">EGR 744T. MT LIGHT GREY. 粗面浅灰色</option>
                                <option value="FGR746T.MT GREY. 粗面灰">FGR746T.MT GREY. 粗面灰</option>
                                <option value="HGR 77T.MT.GREY.深深灰带蓝">HGR 77T.MT.GREY.深深灰带蓝</option>
                                <option value="W H13T.MT WHITE. 粗面白色">W H13T.MT WHITE.粗面白色</option>
                            </select>
                        </td> 
                        <td>
                            <select class="material-dropdown">
                                <option value="MF">MF</option>
                                <option value="NA">NA</option>
                                <option value="PC">PC</option>
                            </select>
                            <select class="sub-material-dropdown" style="display:none;">
                                <option value="MF">MF</option>
                                <option value="NA">NA</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" class="quantity-input" min="1" value="1">
                        </td> 
                        <td class="price-column">0.00</td> 
                        <td><button class="delete-btn">Delete</button></td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row);
            });
        });

        updatePrice(); 
    } else {
        alert(`未查询到该产品`);
    }

    document.getElementById("category-profile-input").value = "";
    document.getElementById("description-input").value = "";
});

function updatePrice() {
    let totalPrice = 0; 

    document.querySelectorAll(".product-table tbody tr").forEach(row => {
        let materialDropdown = row.querySelector(".material-dropdown");
        let subMaterialDropdown = row.querySelector(".sub-material-dropdown");
        let quantityInput = row.querySelector(".quantity-input");
        let priceColumn = row.querySelector(".price-column");

        let lengthElement = row.querySelector(".length-value");
        let lengthValue = lengthElement ? parseFloat(lengthElement.textContent.trim()) || 0 : 0;
        console.log("lengthValue:", lengthValue);

        let materialPrice = {
            MF: parseFloat(document.getElementById("mf-input")?.value) || 0,
            NA: parseFloat(document.getElementById("na-input")?.value) || 0,
            PC: parseFloat(document.getElementById("pc-input")?.value) || 0
        };

        let profileNo = row.cells[1]?.textContent.trim(); 
        let product = jsonData.find(p => p.profile_no.toString() === profileNo);

        console.log("匹配的 product:", product);

        if (!product) {
            console.error(`未找到 profile_no 为 ${profileNo} 的产品`);
            return; 
        }

        let weight = parseFloat(product.weight) || 0;
        let ap_mm = parseFloat(product.ap_mm) || 0;
        let selectedMaterial = materialDropdown.value;
        let quantity = parseInt(quantityInput.value) || 1;
        let price = 0;

        console.log("product weight:", weight);
        console.log("product ap_mm:", ap_mm);
        console.log("selectedMaterial:", selectedMaterial);
        console.log("quantity:", quantity);

        if (selectedMaterial === "PC") {
            let subMaterial = subMaterialDropdown.value;
            let pcPrice = materialPrice["PC"];
            let naPrice = materialPrice["NA"];
            let mfPrice = materialPrice["MF"];

            if (subMaterial === "NA") {
                price = ((ap_mm * 0.010765 * pcPrice * lengthValue) + (weight * lengthValue * naPrice)) * quantity;
            } else {
                price = ((ap_mm * 0.010765 * pcPrice * lengthValue) + (weight * lengthValue * mfPrice)) * quantity;
            }
        } else {
            price = weight * lengthValue * materialPrice[selectedMaterial] * quantity;
        }

        if(product.category === "OPEN BACK" && selectedMaterial ==="PC"){
            let subMaterial = subMaterialDropdown.value;
            let pcPrice = materialPrice["PC"];
            let naPrice = materialPrice["NA"];
            let mfPrice = materialPrice["MF"];

            if (subMaterial === "NA"){
                price = ((ap_mm / 1000 * 10.765 * lengthValue * pcPrice ) + (weight * lengthValue * naPrice)) * quantity;
            }

            if (subMaterial === "MF"){
                price = ((ap_mm / 1000 * 10.765 * lengthValue * pcPrice ) + (weight * lengthValue * mfPrice)) * quantity;
            }
            
        }
        

        // 额外加价（适用于特定类别）
        if (["FLAT BAR", "ECONOMY SLIDING DOOR", "ECONOMY SLIDING WINDOW", "ECONOMY CASEMENT WINDOW", "U CHANNEL", "ANGLE", "HOLLOW"].includes(product.category)) {
            if (weight >= 0.100 && weight <= 0.170) {
                price += 2;              
            } else if (weight > 0.00 && weight < 0.100) {
                price += 3;
            }
        }

        priceColumn.textContent = price.toFixed(2);
        totalPrice += price; 
    });

    let totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
    } else {
        console.error("未找到 total-price 元素，无法更新总价");
    }
}


document.addEventListener("change", function (event) {
    if (event.target.classList.contains("material-dropdown")) {
        let row = event.target.closest("tr");
        let subMaterialDropdown = row.querySelector(".sub-material-dropdown");

        if (event.target.value === "PC") {
            subMaterialDropdown.style.display = "inline-block";
        } else {
            subMaterialDropdown.style.display = "none";
        }

        updatePrice();
    }
});

document.addEventListener("input", function (event) {
    if (
        event.target.classList.contains("material-dropdown") || 
        event.target.classList.contains("sub-material-dropdown") || 
        event.target.classList.contains("quantity-input")
    ) {
        updatePrice();
    }
});

document.querySelectorAll("#mf-input, #na-input, #pc-input").forEach(input => {
    input.addEventListener("input", updatePrice);
});

document.getElementById("newbutton").addEventListener("click", function () {
    let tbody = document.querySelector(".product-table tbody");
    tbody.innerHTML = ""; // 清空表格数据

    document.getElementById("mf-input").value = "";
    document.getElementById("na-input").value = "";
    document.getElementById("pc-input").value = "";

    document.getElementById("total-price").textContent = "Total Price: 0.00";

    document.getElementById("client-input").value = ""; // 清空客户输入
    document.getElementById("client-name").textContent = "Client name:";

    updatePrice(); // 重新计算价格
});

document.querySelectorAll(".filter-checkbox input").forEach(checkbox => {
    checkbox.addEventListener("change", function() {
        let columnIndex = this.getAttribute("data-column"); 

        document.querySelectorAll(`.product-table th:nth-child(${columnIndex}), 
                                   .product-table td:nth-child(${columnIndex})`)
                .forEach(cell => {
                    cell.style.display = this.checked ? "" : "none";
                });
    });
});

document.getElementById("export").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // **标题信息**
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("ACLOUD & ALUMINIUM SDN. BHD.", 105, 20, null, null, "center");

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("No. 15, Jalan Seroja 43, Taman Johor Jaya, 81100 Johor Bahru, Johor.", 105, 25, null, null, "center");
    doc.text("Tel: 018-919 6988    Email: info@acloud.com.my    Homepage: www.acloud.com.my", 105, 30, null, null, "center");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Temporary Sales Order", 105, 40, null, null, "center");

    // **获取客户名称**
    let clientInput = document.getElementById("client-input")?.value || "Default Client Name";
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(clientInput.toUpperCase(), 14, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Attn: MR CHAN", 14, 65, null, null);

    // **获取表格标题**
    let headers = [];
    let data = [];
    let excludeIndex = -1;

    document.querySelectorAll(".product-table thead th").forEach((th, index) => {
        if (th.innerText.toLowerCase().includes("delete")) {
            excludeIndex = index;  // 忽略 "Delete" 列
        } else if (th.style.display !== "none") {
            headers.push(th.innerText);
        }
    });

    // **获取表格数据（包括 dropdown 选择的值 & input 里的 quantity）**
    document.querySelectorAll(".product-table tbody tr").forEach(row => {
        let rowData = [];
        row.querySelectorAll("td").forEach((td, index) => {
            if (index !== excludeIndex && td.style.display !== "none") {
                let dropdown = td.querySelector("select");
                let input = td.querySelector("input"); // 检查是否有输入框

                if (dropdown) {
                    rowData.push(dropdown.options[dropdown.selectedIndex].text); // 获取 dropdown 选中的文本
                } else if (input) {
                    rowData.push(input.value || ""); // 获取 input 里的值（quantity），避免 undefined
                } else {
                    rowData.push(td.innerText.trim()); // 默认获取文本内容
                }
            }
        });
        data.push(rowData); // 确保每一行数据都被正确推入
    });

    // **添加表格到 PDF**
    doc.autoTable({
        startY: 70,  
        head: [headers],
        body: data,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // **显示总价格**
    let totalPrice = document.getElementById("total-price").innerText || "0.00";
    let pageWidth = doc.internal.pageSize.width; // 获取 PDF 页面的宽度
    let rightAlignX = pageWidth - 20;
    doc.text(`Total (RM): ${totalPrice}`, rightAlignX, doc.lastAutoTable.finalY + 10, { align: "right" });

    // **保存 PDF**
    let fileName = `${clientInput.replace(/\s+/g, "_")}-Temporary-Sales-Order.pdf`;
    doc.save(fileName);
});



});
