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
            if (!response.ok) throw new Error("无法加载 JSON 数据");
            return await response.json();
        } catch (error) {
            console.error("数据加载失败:", error);
            alert("无法获取产品数据，请检查 JSON 文件是否正确！");
            return [];
        }
    }

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
    

    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("statusSelect")) {
            if (event.target.value === "urgent") {
                event.target.classList.add("urgent");
            } else {
                event.target.classList.remove("urgent");
            }
        }
    });
    

    async function searchProduct() {
        let categoryInput = document.getElementById("categoryInput")?.value.trim().toLowerCase();
        let descriptionInput = document.getElementById("descriptionInput")?.value.trim().toLowerCase();
        let clientInputElement = document.getElementById("clientInput");
        let lockIcon = document.getElementById("lockIcon");
    
        if (!categoryInput || !descriptionInput) {
            alert("请输入产品类别和描述");
            return;
        }
    
        try {
            let data = await fetchProducts();
    
            let uniqueProducts = {};
            let filteredProducts = data.filter(p => {
                let key = `${p.category.toLowerCase()}|${p.name.toLowerCase()}`;
                if (!uniqueProducts[key]) {
                    uniqueProducts[key] = p;
                    return true;
                }
                return false;
            });

            let product = filteredProducts.find(p => 
                p.category.toLowerCase() === categoryInput &&
                p.name.toLowerCase() === descriptionInput
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
            </select>`;
    
        let statusSelect = `
            <select class="statusSelect">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
            </select>`;
    
        let newRow = `
            <tr>
                <td>${product.category}</td>
                <td>${profileNoHTML}</td>
                <td>${product.name}</td>
                <td>${product.thk_mm}</td>
                <td>${lengthHTML}</td>
                <td>${materialSelect}</td>
                <td class="price"></td>
                <td><textarea class="remarkTextarea" placeholder="Enter remark"></textarea></td>
                <td><textarea class="remarkTextarea" placeholder="Order by..."></textarea></td>
                <td>${statusSelect}</td>
                <td><button class="deleteRow">🗑</button></td>
            </tr>`;
    
        tableBody.insertAdjacentHTML("beforeend", newRow);
    
        let lastRow = tableBody.lastElementChild;
        let materialDropdown = lastRow.querySelector(".materialSelect");
        let lengthDropdown = lastRow.querySelector(".lengthSelect");
        let profileNoDropdown = lastRow.querySelector(".profileNoSelect");
    
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
            this.closest("tr").remove();
            updateTotals();
        });
    }
    
    
    function updatePrices(product, length, materialType, row) {
        let pricePerKg = {
            mf: parseFloat(document.getElementById("mfperkg")?.value) || 0,
            na: parseFloat(document.getElementById("naperkg")?.value) || 0,
            pc: parseFloat(document.getElementById("pcperkg")?.value) || 0
        };
    
        if (product[materialType] === 0 || pricePerKg[materialType] === 0) {
            row.querySelector(".price").innerText = "N/A";
            updateTotals();
            return;
        }
    
        let price = (product.weight * length * pricePerKg[materialType]).toFixed(2);
    
        let category = product.category.trim().toUpperCase();
    
        if (category === "FLAT BAR" && materialType === "na") {
            if (product.weight > 0.00 && product.weight < 0.100) {
                price = (parseFloat(price) + 3).toFixed(2);
            } else if (product.weight >= 0.100 && product.weight <= 0.170) {
                price = (parseFloat(price) + 2).toFixed(2);
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

        document.getElementById("newButton").addEventListener("click", function () {
            document.getElementById("total-price").innerText = "0.00";
        });
        
        

    
});