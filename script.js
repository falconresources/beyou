// Be You Portfolio - JavaScript
// Complete functionality for file uploads, authentication, and portfolio management

console.log('Starting Be You Website...');

const CORRECT_PASSWORD = 'imaneimane2022202320242025 beyou';
let portfolioItems = [];
let currentFiles = [];
let currentFilter = 'all';

// Initialize app when DOM loads
function init() {
    console.log('Initializing...');
    loadData();
    setupEvents();
    checkLogin();
}

// Load saved portfolio data from localStorage
function loadData() {
    try {
        const saved = localStorage.getItem('beYouPortfolio');
        if (saved) {
            portfolioItems = JSON.parse(saved);
            console.log('Loaded items:', portfolioItems.length);
        }
    } catch (e) {
        console.error('Load error:', e);
        portfolioItems = [];
    }
}

// Save portfolio data to localStorage
function saveData() {
    try {
        localStorage.setItem('beYouPortfolio', JSON.stringify(portfolioItems));
        console.log('Data saved');
    } catch (e) {
        console.error('Save error:', e);
    }
}

// Set up all event listeners
function setupEvents() {
    console.log('Setting up events...');
    
    // Login button click
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            handleLogin();
        });
    }

    // Login on Enter key
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }

    // Upload button
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            document.getElementById('uploadSection').classList.remove('hidden');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('beYouLoggedIn');
            showLogin();
        });
    }

    // Choose files button
    const chooseFilesBtn = document.getElementById('chooseFilesBtn');
    if (chooseFilesBtn) {
        chooseFilesBtn.addEventListener('click', function() {
            document.getElementById('fileInput').click();
        });
    }

    // File input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });
    }

    // Save button
    const saveFileBtn = document.getElementById('saveFileBtn');
    if (saveFileBtn) {
        saveFileBtn.addEventListener('click', function() {
            saveFiles();
        });
    }

    // Cancel button
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', function() {
            hideUpload();
        });
    }

    // Drag and drop functionality
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayItems();
        });
    });
}

// Handle login process
function handleLogin() {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const enteredPassword = passwordInput.value.trim();
    
    console.log('Login attempt with password length:', enteredPassword.length);
    console.log('Expected password length:', CORRECT_PASSWORD.length);
    
    if (enteredPassword === CORRECT_PASSWORD) {
        console.log('Password correct, logging in...');
        sessionStorage.setItem('beYouLoggedIn', 'true');
        showPortfolio();
        errorMessage.textContent = '';
        showMsg('Login successful!', 'success');
    } else {
        console.log('Password incorrect');
        errorMessage.textContent = 'Invalid access code. Please try again.';
        showMsg('Invalid password', 'error');
    }
}

// Check if user is already logged in
function checkLogin() {
    if (sessionStorage.getItem('beYouLoggedIn') === 'true') {
        showPortfolio();
    } else {
        showLogin();
    }
}

// Show login screen
function showLogin() {
    console.log('Showing login screen');
    const loginScreen = document.getElementById('loginScreen');
    const portfolioScreen = document.getElementById('portfolioScreen');
    
    if (loginScreen && portfolioScreen) {
        loginScreen.style.display = 'flex';
        portfolioScreen.style.display = 'none';
        
        loginScreen.classList.add('active');
        portfolioScreen.classList.remove('active');
    }
}

// Show portfolio screen
function showPortfolio() {
    console.log('Showing portfolio screen');
    const loginScreen = document.getElementById('loginScreen');
    const portfolioScreen = document.getElementById('portfolioScreen');
    
    if (loginScreen && portfolioScreen) {
        loginScreen.style.display = 'none';
        portfolioScreen.style.display = 'block';
        
        loginScreen.classList.remove('active');
        portfolioScreen.classList.add('active');
        
        console.log('Portfolio screen should now be visible');
        displayItems();
    } else {
        console.error('Could not find login or portfolio screens');
    }
}

// Handle file selection
function handleFiles(files) {
    if (!files || files.length === 0) return;
    
    currentFiles = Array.from(files);
    console.log('Files selected:', currentFiles.length);
    
    const names = currentFiles.map(f => f.name).join(', ');
    document.getElementById('uploadArea').innerHTML = `
        <div class="upload-icon">📄</div>
        <p><strong>Selected Files:</strong></p>
        <p class="selected-files">${names}</p>
        <input type="file" id="fileInput" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.mp3,.mp4" style="display: none;">
        <button type="button" class="btn-primary" id="chooseFilesBtn">Change Files</button>
    `;
    
    // Re-attach event listener
    document.getElementById('chooseFilesBtn').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    showMsg(`${currentFiles.length} file(s) selected`, 'success');
}

// Save files to portfolio
function saveFiles() {
    if (currentFiles.length === 0) {
        showMsg('Please select files to upload', 'error');
        return;
    }
    
    const title = document.getElementById('titleInput').value;
    const desc = document.getElementById('descriptionInput').value;
    let processed = 0;
    
    currentFiles.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const item = {
                id: Date.now() + i,
                title: title || file.name,
                description: desc || '',
                fileName: file.name,
                type: getType(file.name),
                fileSize: formatSize(file.size),
                uploadDate: new Date().toLocaleDateString(),
                fileData: e.target.result
            };
            
            portfolioItems.push(item);
            processed++;
            
            if (processed === currentFiles.length) {
                saveData();
                displayItems();
                hideUpload();
                showMsg(`${currentFiles.length} file(s) uploaded!`, 'success');
            }
        };
        reader.readAsDataURL(file);
    });
}

// Hide upload section and reset form
function hideUpload() {
    document.getElementById('uploadSection').classList.add('hidden');
    currentFiles = [];
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    
    document.getElementById('uploadArea').innerHTML = `
        <div class="upload-icon">📁</div>
        <p>Drag and drop your files here</p>
        <p class="upload-types">Supported: PDF, PowerPoint, Word, MP3, MP4</p>
        <input type="file" id="fileInput" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.mp3,.mp4" style="display: none;">
        <button type="button" class="btn-primary" id="chooseFilesBtn">Choose Files</button>
    `;
    
    setupEvents();
}

// Get file type based on extension
function getType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext)) return 'document';
    if (['ppt', 'pptx'].includes(ext)) return 'presentation';
    if (['mp3'].includes(ext)) return 'audio';
    if (['mp4'].includes(ext)) return 'video';
    return 'document';
}

// Get icon for file type
function getIcon(type) {
    const icons = {
        'document': '📄',
        'presentation': '📊',
        'audio': '🎵',
        'video': '🎬'
    };
    return icons[type] || '📁';
}

// Format file size for display
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Display portfolio items
function displayItems() {
    const grid = document.getElementById('portfolioGrid');
    const items = currentFilter === 'all' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.type === currentFilter);
    
    if (items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h3>Start Building Your Portfolio</h3>
                <p>Click "Add Content" to upload your first piece</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = items.map(item => `
        <div class="portfolio-card">
            <div class="card-icon">${getIcon(item.type)}</div>
            <div class="card-content">
                <h3 class="card-title">${escapeHtml(item.title)}</h3>
                <p class="card-description">${escapeHtml(item.description)}</p>
                <div class="card-meta">
                    <span class="meta-item">📅 ${item.uploadDate}</span>
                    <span class="meta-item">📁 ${item.fileSize}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-action" onclick="downloadItem('${item.id}')">⬇️ Download</button>
                <button class="btn-action btn-delete" onclick="deleteItem('${item.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Download portfolio item
function downloadItem(id) {
    const item = portfolioItems.find(i => i.id == id);
    if (item && item.fileData) {
        const link = document.createElement('a');
        link.href = item.fileData;
        link.download = item.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMsg('File downloaded!', 'success');
    } else {
        showMsg('Download failed', 'error');
    }
}

// Delete portfolio item
function deleteItem(id) {
    if (confirm('Delete this item?')) {
        portfolioItems = portfolioItems.filter(i => i.id != id);
        saveData();
        displayItems();
        showMsg('Item deleted!', 'success');
    }
}

// Show status message
function showMsg(msg, type) {
    const statusMsg = document.getElementById('statusMessage');
    statusMsg.textContent = msg;
    statusMsg.className = `status-message status-${type} show`;
    setTimeout(() => statusMsg.classList.remove('show'), 3000);
}


// Global functions for onclick handlers
window.downloadItem = downloadItem;
window.deleteItem = deleteItem;

// Initialize when ready
document.addEventListener('DOMContentLoaded', init);

console.log('Be You Website loaded successfully!');
