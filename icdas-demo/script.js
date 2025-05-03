// 牙齿数据（FDI编号）
const teeth = ['18','17','16','15','14','13','12','11',
    '21','22','23','24','25','26','27','28',
    '48','47','46','45','44','43','42','41',
    '31','32','33','34','35','36','37','38'];

// ICDAS分级标准（示例图片需自行准备或使用占位图）
const icdasLevels = [
    { level: 1, desc: "白斑（釉质完整）", img: "images/icdas1.png" },
    { level: 2, desc: "釉质缺损", img: "images/icdas2.png" },
    { level: 3, desc: "釉质缺损+牙本质暴露", img: "images/icdas3.png" }
    ];
    

// 医保编码映射规则（需医学伙伴确认）
const insuranceRules = {
1: "K02.9",
2: "K02.9", 
3: "K02.51"
};

// 初始化界面
document.addEventListener('DOMContentLoaded', () => {
// 渲染牙齿网格
const toothMap = document.getElementById('tooth-map');
teeth.forEach(tooth => {
const div = document.createElement('div');
div.className = 'tooth';
div.textContent = tooth;
div.onclick = () => {
 div.classList.toggle('selected');
 updateInsuranceAdvice();
};
toothMap.appendChild(div);
});

// 渲染ICDAS选项
const icdasContainer = document.getElementById('icdas-options');
icdasLevels.forEach(item => {
const div = document.createElement('div');
div.className = 'icdas-option';
div.innerHTML = `
 <input type="radio" name="icdas" value="${item.level}" 
        onchange="updateInsuranceAdvice()">
 <label><b>ICDAS ${item.level}级</b>: ${item.desc}</label>
 <img src="${item.img}" width="100" style="display:block;margin-top:5px;">
`;
icdasContainer.appendChild(div);
});

// 按钮事件
document.getElementById('generate-btn').onclick = generateReport;
document.getElementById('save-btn').onclick = saveRecord;
});

// 更新医保建议
function updateInsuranceAdvice() {
const selectedLevel = document.querySelector('input[name="icdas"]:checked')?.value;
const selectedTeeth = [...document.querySelectorAll('.tooth.selected')]
              .map(el => el.textContent);

if (selectedLevel && selectedTeeth.length > 0) {
const code = insuranceRules[selectedLevel];
document.getElementById('insurance-result').innerHTML = `
 <b>建议医保编码</b>: ${code}<br>
 <small>对应牙位: ${selectedTeeth.join(', ')}</small>
`;
}
}

// 在script.js中修改图片渲染逻辑
div.innerHTML = `
    <input type="radio" name="icdas" value="${item.level}" 
           onchange="updateInsuranceAdvice()">
    <label><b>ICDAS ${item.level}级</b>: ${item.desc}</label>
    <div class="img-container">
        ${item.img.startsWith('data:') ? 
            `<img src="${item.img}" alt="等级${item.level}">` : 
            `<img src="${item.img}" alt="等级${item.level}" 
                  onload="this.style.opacity=1" 
                  style="opacity:0; transition: opacity 0.3s">
             <div class="loading"></div>`
        }
    </div>
`;

// 生成报告
function generateReport() {
const selectedTeeth = [...document.querySelectorAll('.tooth.selected')]
              .map(el => el.textContent);
const icdasLevel = document.querySelector('input[name="icdas"]:checked')?.value;

const result = {
date: new Date().toLocaleString(),
teeth: selectedTeeth,
icdasLevel: icdasLevel,
insuranceCode: insuranceRules[icdasLevel]
};

document.getElementById('output').textContent = JSON.stringify(result, null, 2);
document.getElementById('result').classList.remove('hidden');
}

function selectTeeth(teethNumbers) {
    // 清除现有选择
    document.querySelectorAll('.tooth.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 选择指定牙位
    teethNumbers.forEach(num => {
        const tooth = [...document.querySelectorAll('.tooth')]
                     .find(el => el.textContent === num);
        if (tooth) tooth.classList.add('selected');
    });
    
    updateInsuranceAdvice();
}

// 在script.js末尾添加
function initHistoryPanel() {
    const saved = localStorage.getItem('icdasRecords');
    if (saved) {
        const historyBtn = document.createElement('button');
        historyBtn.textContent = '查看历史记录';
        historyBtn.onclick = () => {
            alert(`最近记录：\n${saved}`);
        };
        document.querySelector('.actions').appendChild(historyBtn);
    }
}
// 在DOM加载后调用
document.addEventListener('DOMContentLoaded', initHistoryPanel);

// 保存记录（模拟）
function saveRecord() {
alert('记录已保存（演示功能）');
// 实际可替换为localStorage或后端API
}

// 更新医保建议函数
function updateInsuranceAdvice() {
    const selectedLevel = document.querySelector('input[name="icdas"]:checked')?.value;
    const selectedTeeth = [...document.querySelectorAll('.tooth.selected')]
                         .map(el => el.textContent);
    
    if (selectedLevel && selectedTeeth.length > 0) {
        const code = insuranceRules[selectedLevel];
        const treatments = {
            "K02.9": "常规填充（复合树脂）",
            "K02.51": "磨牙复杂充填"
        };
        document.getElementById('insurance-result').innerHTML = `
            <div class="insurance-card">
                <b>💰 医保建议</b>
                <p>编码：${code}（${treatments[code]}）</p>
                <small>适用牙位：${selectedTeeth.join(', ')}</small>
            </div>
        `;
    }
}