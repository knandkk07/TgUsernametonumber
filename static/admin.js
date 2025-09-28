// Admin Dashboard JavaScript

let currentTab = 'users';
let currentEditId = null;
let currentEditType = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadTabData('users');
});

// Switch tabs
function switchTab(tabName, tabElement) {
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active to clicked tab
    tabElement.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'users':
            loadUsers();
            break;
        case 'usernames':
            loadUsernames();
            break;
        case 'searched':
            loadSearchedUsernames();
            break;
        case 'utrs':
            loadUtrs();
            break;
        case 'message':
            loadCustomMessage();
            break;
    }
}

// Statistics
function loadStatistics() {
    fetch('/admin/api/statistics')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').textContent = data.users;
            document.getElementById('totalUsernames').textContent = data.usernames;
            document.getElementById('totalUtrs').textContent = data.utrs;
        })
        .catch(error => {
            showNotification('Error loading statistics', 'error');
        });
}

// Users Management
function loadUsers() {
    showLoading();
    fetch('/admin/api/users')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            renderUsers(data);
        })
        .catch(error => {
            hideLoading();
            showNotification('Error loading users', 'error');
        });
}

function renderUsers(data) {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.className = 'table-row-animated';

        row.innerHTML = `
            <td><span class="id-badge">${item.id}</span></td>
            <td><span class="username-display">${item.name}</span></td>
            <td><span class="code-display">${item.hash_code}</span></td>
            <td><span class="balance-amount">₹${item.balance}</span></td>
            <td><span class="date">${new Date(item.created_at).toLocaleDateString()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn delete-btn" onclick="deleteItem('users', ${item.id})" title="Delete">
                        <i class="icon">🗑️</i> Delete
                    </button>
                    <button class="action-btn edit-btn" onclick="showAddBalanceModal(${item.id})" title="Add Balance">
                        <i class="icon">➕</i> Add Balance
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Usernames Management
function loadUsernames() {
    showLoading();
    fetch('/admin/api/usernames')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            renderUsernames(data);
        })
        .catch(error => {
            hideLoading();
            showNotification('Error loading usernames', 'error');
        });
}

function renderUsernames(data) {
    const tbody = document.getElementById('usernamesTable');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.className = 'table-row-animated';

        row.innerHTML = `
            <td><span class="id-badge">${item.id}</span></td>
            <td><span class="username-display">@${item.username}</span></td>
            <td><span class="phone-list">${item.mobile_number}</span></td>
            <td><span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">${item.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editItem('usernames', ${item.id})" title="Edit">
                        <i class="icon">✏️</i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteItem('usernames', ${item.id})" title="Delete">
                        <i class="icon">🗑️</i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Searched Usernames Management
function loadSearchedUsernames() {
    showLoading();
    fetch('/admin/api/searched-usernames')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            renderSearchedUsernames(data);
        })
        .catch(error => {
            hideLoading();
            showNotification('Error loading searched usernames', 'error');
        });
}

function renderSearchedUsernames(data) {
    const tbody = document.getElementById('searchedUsernamesTable');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.className = 'table-row-animated';

        row.innerHTML = `
            <td><span class="id-badge">${item.id}</span></td>
            <td><span class="username-display">@${item.username}</span></td>
            <td><span class="phone-list">${item.searched_by}</span></td>
            <td><span class="date">${new Date(item.searched_at).toLocaleDateString()}</span></td>
            <td><span class="status-badge status-inactive">${item.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}


// UTRs Management
function loadUtrs() {
    showLoading();
    fetch('/admin/api/utrs')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            renderUtrs(data);
        })
        .catch(error => {
            hideLoading();
            showNotification('Error loading UTRs', 'error');
        });
}

function renderUtrs(data) {
    const tbody = document.getElementById('utrsTable');
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.className = 'table-row-animated';

        row.innerHTML = `
            <td><span class="id-badge">${item.id}</span></td>
            <td><span class="code-display">${item.utr}</span></td>
            <td><span class="description">${item.description || 'No description'}</span></td>
            <td><span class="status-badge ${item.active ? 'status-active' : 'status-inactive'}">${item.active ? 'Active' : 'Inactive'}</span></td>
            <td><span class="date">${new Date(item.created_at).toLocaleDateString()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn delete-btn" onclick="deleteItem('utrs', ${item.id})" title="Delete">
                        <i class="icon">🗑️</i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal Functions
function showAddModal(type) {
    currentEditType = type;
    currentEditId = null;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');

    switch(type) {
        case 'usernames':
            modalTitle.textContent = 'Add Username';
            modalForm.innerHTML = `
                <div class="form-group">
                    <label class="form-label">
                        <span>👤</span>
                        Username
                    </label>
                    <input type="text" id="username" class="form-input" placeholder="Username (without @)" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <span>📱</span>
                        Mobile Number
                    </label>
                    <input type="text" id="mobile_number" class="form-input" placeholder="Enter mobile number" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <span>📝</span>
                        Mobile Details
                    </label>
                    <textarea id="mobile_details" class="form-input" placeholder="Enter mobile number details" rows="3"></textarea>
                </div>
            `;
            break;

        case 'utrs':
            modalTitle.textContent = 'Add UTR';
            modalForm.innerHTML = `
                <div class="form-group">
                    <label class="form-label">
                        <span>🏦</span>
                        UTR Number
                    </label>
                    <input type="text" id="utr" class="form-input" placeholder="Enter UTR number" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <span>📝</span>
                        Description
                    </label>
                    <input type="text" id="description" class="form-input" placeholder="Enter description">
                </div>
            `;
            break;
    }

    modal.style.display = 'block';
    modal.classList.add('modal-show');
}

// Function to show modal for adding balance to a user
function showAddBalanceModal(userId) {
    currentEditId = userId; // Store the user ID
    currentEditType = 'users'; // Set the type to users for balance update

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');

    modalTitle.textContent = 'Add Balance';
    modalForm.innerHTML = `
        <div class="form-group">
            <label class="form-label">
                <span>💰</span>
                Amount to Add
            </label>
            <input type="number" id="balance_amount" class="form-input" placeholder="Enter amount to add" required min="0">
        </div>
    `;

    modal.style.display = 'block';
    modal.classList.add('modal-show');
}


function editItem(type, id) {
    currentEditType = type;
    currentEditId = id;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalForm = document.getElementById('modalForm');

    // Get item data first
    let endpoint = '';
    switch(type) {
        case 'usernames':
            endpoint = `/admin/api/usernames/${id}`;
            modalTitle.textContent = 'Edit Username';
            break;
    }

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            switch(type) {
                case 'usernames':
                    modalForm.innerHTML = `
                        <div class="form-group">
                            <label class="form-label">
                                <span>👤</span>
                                Username
                            </label>
                            <input type="text" id="username" class="form-input" value="${data.username}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <span>📱</span>
                                Mobile Number
                            </label>
                            <input type="text" id="mobile_number" class="form-input" value="${data.mobile_number}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">
                                <span>📝</span>
                                Mobile Details
                            </label>
                            <textarea id="mobile_details" class="form-input" rows="3">${typeof data.mobile_details === 'string' ? data.mobile_details : JSON.stringify(data.mobile_details, null, 2)}</textarea>
                        </div>
                    `;
                    break;
            }

            modal.style.display = 'block';
            modal.classList.add('modal-show');
        })
        .catch(error => {
            showNotification('Error loading item data', 'error');
        });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.classList.remove('modal-show');
    currentEditType = null;
    currentEditId = null;
}

function submitForm() {
    const isEdit = currentEditId !== null;
    let endpoint = '';
    let method = isEdit ? 'PUT' : 'POST';
    let formData = {};

    switch(currentEditType) {
        case 'users': // Handling balance addition
            endpoint = `/admin/api/users/${currentEditId}/add-balance`;
            formData = {
                amount: parseFloat(document.getElementById('balance_amount').value)
            };
            method = 'POST'; // Use POST for adding balance
            break;
        case 'usernames':
            endpoint = isEdit ? `/admin/api/usernames/${currentEditId}` : '/admin/api/usernames';
            formData = {
                username: document.getElementById('username').value,
                mobile_number: document.getElementById('mobile_number').value,
                mobile_details: document.getElementById('mobile_details').value
            };
            break;

        case 'utrs':
            endpoint = '/admin/api/utrs';
            formData = {
                utr: document.getElementById('utr').value,
                description: document.getElementById('description').value
            };
            break;
    }

    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || `HTTP error ${response.status}`) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            closeModal();
            loadTabData(currentEditType); // Reload the current tab's data
            if (currentEditType === 'users') { // Special handling for user balance update
                loadUsers(); // Reload users to show updated balance
            }
            loadStatistics(); // Update overall statistics
            showNotification(isEdit ? 'Item updated successfully' : 'Item added successfully', 'success');
        } else {
            showNotification(data.error || 'Error saving item', 'error');
        }
    })
    .catch(error => {
        showNotification(`Error: ${error.message}`, 'error');
    });
}

function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    let endpoint = '';
    switch(type) {
        case 'users':
            endpoint = `/admin/api/users/${id}`;
            break;
        case 'usernames':
            endpoint = `/admin/api/usernames/${id}`;
            break;
        case 'utrs':
            endpoint = `/admin/api/utrs/${id}`;
            break;
    }

    fetch(endpoint, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTabData(type);
            loadStatistics();
            showNotification('Item deleted successfully', 'success');
        } else {
            showNotification(data.error || 'Error deleting item', 'error');
        }
    })
    .catch(error => {
        showNotification('Error deleting item', 'error');
    });
}

// Function to delete a searched username
function deleteSearchedUsername(id) {
    if (!confirm('Are you sure you want to delete this searched username?')) {
        return;
    }

    fetch(`/admin/api/searched-usernames/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadSearchedUsernames(); // Reload the searched usernames tab
            showNotification('Searched username deleted successfully', 'success');
        } else {
            showNotification(data.error || 'Error deleting searched username', 'error');
        }
    })
    .catch(error => {
        showNotification('Error deleting searched username', 'error');
    });
}


// Utility Functions
function showLoading() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="loading-spinner" id="loadingSpinner">
            <div class="spinner-content">
                <div class="spinner"></div>
                <div>Loading...</div>
            </div>
        </div>
    `);
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function logout() {
    fetch('/admin/logout', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = '/admin/login';
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Custom Message Management
function loadCustomMessage() {
    showLoading();
    fetch('/admin/api/custom-message')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            document.getElementById('customMessageText').value = data.message;
        })
        .catch(error => {
            hideLoading();
            showNotification('Error loading custom message', 'error');
        });
}

function saveCustomMessage() {
    const message = document.getElementById('customMessageText').value.trim();
    
    if (!message) {
        showNotification('Message cannot be empty', 'error');
        return;
    }

    fetch('/admin/api/custom-message', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Custom message updated successfully! 🎉', 'success');
        } else {
            showNotification(data.error || 'Error saving message', 'error');
        }
    })
    .catch(error => {
        showNotification('Error saving custom message', 'error');
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});