self.addEventListener('install', (event) => {
        console.log("Service Worker Installed");
    });

    self.addEventListener('fetch', (event) => {
        console.log("Fetching:", event.request.url);
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.log("SW Registration Failed", err));
    }


document.addEventListener("DOMContentLoaded", function () {
    async function fetchProducts() {
    try {
        let response = await fetch("products.json");
        if (!response.ok) throw new Error(`无法加载 JSON 数据: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("数据加载失败:", error);
        alert("无法获取产品数据，请检查 JSON 文件路径！");
        return [];
    }
}



document.querySelectorAll(".column-toggle").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        let columnIndex = this.getAttribute("data-column");
        let table = document.querySelector("table");
        
        table.querySelectorAll("tr").forEach(row => {
            let cell = row.children[columnIndex];
            if (cell) {
                cell.style.display = this.checked ? "" : "none";
            }
        });
    });
});





    function updateDate() {
        let dateElement = document.getElementById("date");
        if (dateElement) {
            let today = new Date();
            let formattedDate = today.toISOString().split("T")[0]; 
            dateElement.textContent = formattedDate;
        }
    }

    updateDate(); 

document.getElementById("newButton").addEventListener("click", function () {
    updateDate(); 
});


document.getElementById("newButton").addEventListener("click", function () {
    document.getElementById("tableBody").innerHTML = "";
    document.getElementById("clientInput").value = "";
    document.getElementById("categoryInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("mfperkg").value = "";
    document.getElementById("naperkg").value = "";
    document.getElementById("pcperkg").value = "";

    let clientInput = document.getElementById("clientInput");
    clientInput.removeAttribute("readonly");
    clientInput.style.backgroundColor = "";

    document.getElementById("client_name").innerHTML = "Client:";
    document.getElementById("lockIcon").style.display = "none"; 
});

let statusButton = document.getElementById("status-select");

statusButton.addEventListener("click", function () {
    if (this.innerText === "Normal") {
        this.innerText = "Urgent";
        this.style.backgroundColor = "red";
        this.style.color = "white";
    } else {
        this.innerText = "Normal";
        this.style.backgroundColor = "";
        this.style.color = "";
    }
});
    

async function searchProduct() {
    let categoryInput = document.getElementById("categoryInput")?.value.trim().toLowerCase();
    let descriptionInput = document.getElementById("descriptionInput")?.value.trim().toLowerCase();
    let clientInputElement = document.getElementById("clientInput");
    let lockIcon = document.getElementById("lockIcon");

    if (!categoryInput && !descriptionInput) {
        alert("请输入产品类别、描述或 Profile No");
        return;
    }

    try {
        let data = await fetchProducts();

        let uniqueProducts = {};
        let filteredProducts = data.filter(p => {
            let key = `${p.category.toLowerCase()}|${p.name.toLowerCase()}|${p.profile_no}`;
            if (!uniqueProducts[key]) {
                uniqueProducts[key] = p;
                return true;
            }
            return false;
        });

        let product = filteredProducts.find(p => 
    (p.category.toLowerCase().includes(categoryInput) || p.profile_no.toString().includes(categoryInput)) &&
    (!descriptionInput || p.name.toLowerCase().includes(descriptionInput))
);


        if (!product) {
            alert("未找到匹配的产品");
            return;
        }

        let clientInput = clientInputElement ? clientInputElement.value.trim().toUpperCase() : "N/A";
        let clientNameElement = document.getElementById("client_name");

        if (clientInput) {
            clientNameElement.innerHTML = `Client: ${clientInput}`;
            clientInputElement.setAttribute("readonly", "true");  
            clientInputElement.style.backgroundColor = "#f0f0f0"; 
            lockIcon.style.display = "inline"; 
        }

        setTimeout(() => {
            clientInputElement.setAttribute("readonly", "true");
        }, 100);

        addNewProduct(product, data);

        document.getElementById("categoryInput").value = "";
        document.getElementById("descriptionInput").value = "";

    } catch (error) {
        console.error("数据加载失败:", error);
        alert("无法获取产品数据，请检查 JSON 文件是否正确！");
    } 
}

    
    function addNewProduct(product, allProducts) {
        let tableBody = document.getElementById("tableBody");
        if (!tableBody) return;
 
        let matchingProducts = allProducts.filter(p => 
            p.category === product.category && p.name === product.name
        );
    
        let profileNoHTML;
        if (matchingProducts.length > 1) {
            profileNoHTML = `<select class="profileNoSelect">
                                ${matchingProducts.map(p => `<option value="${p.profile_no}">${p.profile_no}</option>`).join("")}
                             </select>`;
        } else {
            profileNoHTML = product.profile_no;
        }
    
        let lengthArray = Array.isArray(product.length) ? product.length : [product.length];
    
        let lengthHTML;
        if (lengthArray.length > 1) {
            lengthHTML = `<select class="lengthSelect" data-profile="${product.profile_no}">
                                ${lengthArray.map(len => `<option value="${len}">${len} m</option>`).join("")}
                          </select>`;
        } else {
            lengthHTML = lengthArray[0];
        }
            
        let materialSelect = `
            <select class="materialSelect">
                <option value="mf">MF</option>
                <option value="na">NA</option>
                <option value="pc">PC</option>
            </select>
            <div class="baseMaterialContainer" style="display: none;">
                <select id="baseMaterial" class="baseMaterialSelect">
                    <option value="na">NA</option>
                    <option value="mf">MF</option>
                </select>
            </div>`;
             
        let statusSelect = `
            <select class="statusSelect">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
            </select>`;

            let colordropdown = `
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
            </select>`;
      
            let quantityInput = `<input type="number" class="quantityInput" min="1" value="1" style="width: 60px;">`;
            let newRow = `
            <tr>
                <td>${product.category}</td>
                <td>${profileNoHTML}</td>
                <td>${product.name}</td>
                <td>${product.thk_mm}</td>
                <td>${lengthHTML}</td>
                <td>${colordropdown}</td>
                <td>${materialSelect}</td>
                <td>${quantityInput}</td>  <!-- 添加数量输入框 -->
                <td class="price"></td>
                <td><button class="deleteRow">🗑</button></td>
            </tr>`;

        tableBody.insertAdjacentHTML("beforeend", newRow);
        let lastRow = tableBody.lastElementChild;
        let materialDropdown = lastRow.querySelector(".materialSelect");
        let lengthDropdown = lastRow.querySelector(".lengthSelect");
        let profileNoDropdown = lastRow.querySelector(".profileNoSelect");
        let quantityInputField = lastRow.querySelector(".quantityInput"); 
        let baseMaterialContainer = lastRow.querySelector(".baseMaterialContainer");
        let baseMaterialDropdown = lastRow.querySelector(".baseMaterialSelect");
        

        materialDropdown.addEventListener("change", function () {
            if (this.value === "pc") {
                baseMaterialContainer.style.display = "block";
            } else {
                baseMaterialContainer.style.display = "none";
            }
        });

        quantityInputField.addEventListener("input", updatePrice);
        

        function updateTime() {
            let now = new Date();
            let formattedTime = now.toLocaleString('en-US', { hour12: false });
            document.getElementById("currentTime").innerText = formattedTime;
        }
        setInterval(updateTime, 1000); 
        updateTime();
    
        function updatePrice() {
            let selectedMaterial = materialDropdown.value;
            let selectedLength = lengthDropdown ? parseFloat(lengthDropdown.value) : parseFloat(product.length);
            let selectedProfileNo = profileNoDropdown ? parseInt(profileNoDropdown.value) : product.profile_no;
    
            let selectedProduct = matchingProducts.find(p => p.profile_no === selectedProfileNo);
    
            if (selectedProduct) {
                updatePrices(selectedProduct, selectedLength, selectedMaterial, lastRow);
            }
        }
    
        materialDropdown.addEventListener("change", updatePrice);
            if (lengthDropdown) {
                lengthDropdown.addEventListener("change", updatePrice);
                lengthDropdown.dispatchEvent(new Event("change"));
            } else {
                updatePrice();
            }
        
            if (profileNoDropdown) {
                profileNoDropdown.addEventListener("change", updatePrice);
            }
        
            lastRow.querySelector(".deleteRow").addEventListener("click", function () {
                let confirmDelete = confirm("确定要删除该项吗？");
                if (confirmDelete) {
                    this.closest("tr").remove();
                    updateTotals();
                }
            });
            
        }

        function updatePrices(product, length, materialType, row) {
            let pricePerKg = {
                mf: parseFloat(document.getElementById("mfperkg")?.value) || 0,
                na: parseFloat(document.getElementById("naperkg")?.value) || 0,
                pc: parseFloat(document.getElementById("pcperkg")?.value) || 0
            };
        
            let quantity = parseInt(row.querySelector(".quantityInput").value) || 1; 
            let baseMaterialSelectElement = row.querySelector(".baseMaterialSelect");
            let baseMaterialSelect = baseMaterialSelectElement ? baseMaterialSelectElement.value : null;
        
        
            let price = (product.weight * length * pricePerKg[materialType] * quantity).toFixed(2); 
        
            let category = product.category.trim().toUpperCase();
        
            if (category === "OPEN BACK" && materialType === "na") {
                price = (product.weight * length * pricePerKg[materialType] * quantity).toFixed(2);
            }
        
            if (category === "OPEN BACK" && materialType === "pc") {
                let naPrice = (product.weight * length * pricePerKg["na"]) || 0;
                price = ((product.ap_mm / 1000 * 10.765 * length * pricePerKg["pc"]) + parseFloat(naPrice)) * quantity;
                price = price.toFixed(2);
            }
            
        
            if (materialType === "pc" && baseMaterialSelect === "na") {
                let naPrice = (product.weight * length * pricePerKg["na"]) || 0;
                price = ((product.ap_mm * 0.010765 * pricePerKg["pc"] * length) + naPrice) * quantity;
                price = price.toFixed(2);
            }

            if (materialType === "pc" && baseMaterialSelect === "mf") {
                let mfPrice = (product.weight * length * pricePerKg["mf"]) || 0;
                price = ((product.ap_mm * 0.010765 * pricePerKg["pc"] * length) + mfPrice) * quantity;
                price = price.toFixed(2);
            }

            if (["FLAT BAR", "ECONOMY SLIDING DOOR", "ECONOMY SLIDING WINDOW", "ECONOMY CASEMENT WINDOW", "U CHANNEL", "ANGLE", "HOLLOW"].includes(category) && materialType === "na") {
                if (product.weight > 0.00 && product.weight < 0.100) {
                    price = (parseFloat(price) + 3 * quantity).toFixed(2);
                } else if (product.weight >= 0.100 && product.weight <= 0.170) {
                    price = (parseFloat(price) + 2 * quantity).toFixed(2);
                }
                
            }

            row.querySelector(".price").innerText = price;
            updateTotals();
        }
       
        let searchButton = document.getElementById("searchButton");
            if (searchButton) {
                searchButton.addEventListener("click", searchProduct);
            }

            function updateTotals() {
                let totalPrice = 0;
            
                document.querySelectorAll("#tableBody .price").forEach(priceCell => {
                    let priceValue = priceCell.innerText.trim();
                    if (!isNaN(parseFloat(priceValue)) && priceValue !== "N/A") {
                        totalPrice += parseFloat(priceValue);
                    }
                });
            
                document.getElementById("total-price").innerText = totalPrice.toFixed(2);
            }

            function generateDocument() {
                let clientInput = document.getElementById("clientInput").value.trim();
                if (!clientInput) {
                    clientInput = "DEFAULT CLIENT NAME";
                }
                console.log("Final clientInput:", clientInput);
                doc.text(clientInput.toUpperCase(), 14, 56);
            }
            
            document.getElementById("generate-pdf").addEventListener("click", function () {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

            
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
            
                let clientInput = document.getElementById("clientInput")?.value || "Default Client Name";
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(clientInput.toUpperCase(), 14, 50);
                doc.setFont("helvetica", "bold");
                doc.text("Attn: MR CHAN", 14, 65, null, null);
            
                const table = document.getElementById("resultTable");
                if (!table) {
                    alert("Table not found!");
                    return;
                }
            
                let headers = [];
                let data = [];
            
                let headerCells = table.querySelector("thead tr").children;
                for (let i = 0; i < headerCells.length; i++) {
                    if (headerCells[i].style.display !== "none" && headerCells[i].innerText.trim().toLowerCase() !== "delete") {
                        headers.push(headerCells[i].innerText.trim());
                    }
                }
            
                let rows = table.querySelectorAll("tbody tr");
                rows.forEach(row => {
                    let rowData = [];
                    let cells = row.children;
                    for (let i = 0; i < cells.length; i++) {
                        if (cells[i].style.display !== "none" && headerCells[i]?.innerText.trim().toLowerCase() !== "delete") {
                            
                            if (headerCells[i]?.innerText.trim().toLowerCase() === "material") {
                                let selectElement = cells[i].querySelector("select");
                                if (selectElement) {
                                    let selectedOption = selectElement.options[selectElement.selectedIndex].text;
                                    rowData.push(selectedOption);
                                } else {
                                    rowData.push(cells[i].innerText.trim());
                                }

                            } else if (headerCells[i]?.innerText.trim().toLowerCase() === "length(m)") {
                                    let selectElement = cells[i].querySelector("select");
                                    if (selectElement) {
                                        let selectedOption = selectElement.options[selectElement.selectedIndex].text;
                                        rowData.push(selectedOption);
                                    } else {
                                        rowData.push(cells[i].innerText.trim());
                                    }

                            } else if (headerCells[i]?.innerText.trim().toLowerCase() === "profile no.") {
                                let selectElement = cells[i].querySelector("select");
                                if (selectElement) {
                                    let selectedOption = selectElement.options[selectElement.selectedIndex].text;
                                    rowData.push(selectedOption);
                                } else {
                                    rowData.push(cells[i].innerText.trim());
                                }

                            } else if (headerCells[i]?.innerText.trim().toLowerCase() === "color") {
                                let selectElement = cells[i].querySelector("select");
                                if (selectElement) {
                                    let selectedOption = selectElement.options[selectElement.selectedIndex].text;
                                    rowData.push(selectedOption);
                                } else {
                                    rowData.push(cells[i].innerText.trim());
                                }
            
                            } else if (headerCells[i]?.innerText.trim().toLowerCase() === "quantity") {
                                let quantityInput = cells[i].querySelector("input");
                                if (quantityInput) {
                                    rowData.push(quantityInput.value.trim() || "0"); 
                                } else {
                                    rowData.push(cells[i].innerText.trim()); 
                                }
            
                            } else {
                                rowData.push(cells[i].innerText.trim());
                            }
                        }
                    }
                    data.push(rowData);
                });
            
                doc.autoTable({
                    head: [headers],
                    body: data,
                    startY: 70,
                    theme: "grid",
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [255, 255, 255], // 头部背景白色
                        textColor: [0, 0, 0], // 文字黑色
                        lineWidth: { top: 0.5, right: 0, bottom: 0.5, left: 0 },
                        lineColor: [0, 0, 0]}
                });
            
                let totalPrice = document.getElementById("total-price").innerText || "0.00";
                let pageWidth = doc.internal.pageSize.width; // 获取 PDF 页面的宽度
                let rightAlignX = pageWidth - 20;
                doc.text(`Total (RM): ${totalPrice}`, rightAlignX, doc.lastAutoTable.finalY + 10, { align: "right" });
            
                doc.save(`${clientInput}_Sales_Order.pdf`);
            });

            

            
            

            


            
            
            
            
            
            
            
 
});
