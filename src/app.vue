<template>
  <div class="wrapper">
    <span 
      class="cloeseBtn" 
      @click="showModel"
      :style="{backgroundColor:show?'#1d4ed8':'#10b981'}"
    >
      {{ show?"关闭插件":"打开插件" }}
    </span>
    <div 
      class="score-table-container"
      :style="{ top: modalTop + 'px', left: modalLeft + 'px' }"
      @mousedown="handleMouseDown"
      @click.stop
      v-show="show"
    >
      <h2 class="drag-header">青果系统成绩批量录入插件</h2>
      <!-- 批量输入区域：多行文本框 + 提示 + 按钮 -->
      <div class="batch-input-group">
        <div class="input-tip">
          输入格式：姓名 分数（每行1条，姓名和分数用空格分隔，如：张三 95）
        </div>
        <textarea
          v-model="batchInputContent"
          :placeholder="placeholderText"
          class="batch-input"
          rows="6"
        ></textarea>
        <!-- JSON结果展示 -->
        <div class="json-result" v-if="jsonResult">{{ formattedJson }}</div>
        <!-- 功能按钮 -->
        <div style="text-align: center;">
          <button class="batch-add-btn" @click="batchAddData">添加数据</button>
          <button class="parse-btn" @click="insertGrade">提交数据</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "./app.less";
export default {
  name: "qx_input_grade",
  data() {
    return {
      // 定义包含换行的placeholder文本
      placeholderText: '例如：\n张三 95\n李四 88\n王五 92',
      // 批量输入的文本内容（按换行分割）
      batchInputContent: "",
      // 表格数据源
      tableData: [],
      // 解析后的JSON对象
      jsonResult: null,
      // 模态框控制
      modalTop: 0, // 模态框初始top值
      modalLeft: 0, // 模态框初始left值
      isDragging: false, // 是否正在拖动
      startX: 0, // 拖动起始X坐标
      startY: 0, // 拖动起始Y坐标
      show: true
    };
  },
  computed: {
    // 格式化JSON展示
    formattedJson() {
      if (!this.jsonResult) return "";
      return JSON.stringify(this.jsonResult, null, 2);
    },
  },
  methods: {
    // 核心：批量解析输入内容并添加到表格
    batchAddData() {
      // 1. 校验输入是否为空
      if (!this.batchInputContent.trim()) {
        alert("请输入学生成绩信息！");
        return;
      }

      // 2. 按换行分割内容，过滤空行
      const lines = this.batchInputContent
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      const validData = []; // 存储校验通过的学生数据
      const errorLines = []; // 存储错误行信息

      // 3. 遍历每一行，解析并校验格式
      lines.forEach((line, index) => {
        const lineNum = index + 1; // 行号（方便提示错误）
        const [name, scoreStr] = line.trim().split(/\s+/); // 按任意空格分割（支持多个空格）

        // 校验1：姓名不能为空
        if (!name || !name.trim()) {
          errorLines.push(`第${lineNum}行：姓名不能为空`);
          return;
        }

        // 校验2：分数必须是数字且在0-100之间
        if(scoreStr!="优秀" && scoreStr!="良好" && scoreStr!="合格" && scoreStr!="不合格"){
          const score = Number(scoreStr);
          if (isNaN(score) || score < 0 || score > 100) {
            errorLines.push(
              `第${lineNum}行：分数必须是【0-100之间的有效数字】或【优秀、良好、合格、不合格】（当前值：${
                scoreStr || "空"
              }）`
            );
            return;
          }
        }
        

        // 校验通过，加入有效数据
        validData.push({
          name: name.trim(),
          score: isNaN(scoreStr) ? scoreStr : Number(scoreStr)
        });
      });

      // 4. 处理错误：如果有错误行，提示并终止
      if (errorLines.length > 0) {
        alert(`输入格式错误：\n${errorLines.join("\n")}`);
        return;
      }

      // 5. 无错误则添加到表格，清空输入框
      this.tableData = [...this.tableData, ...validData];
      this.batchInputContent = "";
      alert(`成功添加${validData.length}条学生数据！`);
      this.parseTableToJson();
    },
    // 解析表格为JSON（姓名为键，分数为值）
    parseTableToJson() {
      const result = {};
      this.tableData.forEach((item) => {
        if (item.name && item.score) {
          result[item.name] = item.score;
        }
      });
      this.jsonResult = result;
    },
    insertGrade(){
      var ipts=document.querySelectorAll(".CJTD[id$=_zhcj]>input");
      if(ipts && ipts.length>0){
        for(var i=0; i<ipts.length; i++){
          var stu_name=document.querySelectorAll(".CJTD[id$=_zhcj]>input")[i].parentElement.parentElement.children[2].innerText.slice(0,-1);
          this.setInputValue(ipts[i], this.jsonResult[stu_name]);
        }
      }
      var sels=document.querySelectorAll(".CJTD>select");
      if (sels && sels.length>0) {
        for(var i=0; i<sels.length; i++){
          var stu_name=document.querySelectorAll(".CJTD>select")[i].parentElement.parentElement.children[2].innerText.slice(0,-1);
          setSelectedValue(sels[i], this.jsonResult[stu_name]); 
        }
      }
    },
    setInputValue(input, valueToSet) {
      input.value=valueToSet
    },
    setSelectedValue(select, valueToSet) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].innerText === valueToSet) {
          select.selectedIndex = i;
          break;
        }
      }
    },
    // 模态框拖动逻辑
    handleMouseDown(e) {
      // 仅允许点击头部拖动（避免点击主体也触发）
      if (e.target.closest('.drag-header')) {
        this.isDragging = true
        this.startX = e.clientX - this.modalLeft
        this.startY = e.clientY - this.modalTop
        // 添加全局监听（鼠标移动/松开）
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)
      }
    },
    handleMouseMove(e) {
      if (this.isDragging) {
        this.modalLeft = e.clientX - this.startX
        this.modalTop = e.clientY - this.startY
        this.modalLeft = Math.max(0, Math.min(this.modalLeft, window.innerWidth - 434))
        this.modalTop = Math.max(0, Math.min(this.modalTop, window.innerHeight - 331))
      }
    },
    handleMouseUp() {
      this.isDragging = false
      // 移除全局监听
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    showModel(){
      this.show=!this.show
    }
  },
};
</script>