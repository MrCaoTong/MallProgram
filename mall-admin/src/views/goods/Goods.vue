<template>
  <div class="goods-page">
    <el-card>
      <div style="margin-bottom: 20px; display: flex; align-items: center;">
        <el-input v-model="searchName" placeholder="商品名称" style="width: 200px; margin-right: 10px;" clearable />
        <el-select v-model="searchCategory" placeholder="商品分类" style="width: 180px; margin-right: 10px;" clearable>
          <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-button type="primary" @click="fetchGoods">搜索</el-button>
        <el-button type="primary" style="margin-left: auto;" @click="openAddDialog">新增商品</el-button>
        <el-button @click="batchChangeStatus(1)" style="margin-left: 10px;">批量上架</el-button>
        <el-button @click="batchChangeStatus(0)" style="margin-left: 10px;">批量下架</el-button>
      </div>
      <el-table :data="goodsList" border @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="image" label="图片" width="100">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" style="width: 80px; height: 80px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="category_name" label="所属分类" />
        <el-table-column prop="status" label="上架状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增/编辑商品弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="max-height:60vh;overflow-y:auto;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类">
            <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品主图" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :headers="uploadHeaders"
            with-credentials>
            <img v-if="form.image" :src="form.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="上架状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <quill-editor v-model="form.detail" :options="editorOption" style="height:120px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoods, addGoods, updateGoods, deleteGoods, batchUpdateGoodsStatus } from '@/api/goods';
import { getCategories } from '@/api/category';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: 'Goods',
  components: { quillEditor },
  data() {
    return {
      goodsList: [],
      categoryList: [],
      searchName: '',
      searchCategory: '',
      dialogVisible: false,
      dialogTitle: '新增商品',
      form: {
        id: null,
        name: '',
        category_id: '',
        image: '',
        price: 0,
        stock: 0,
        status: 1,
        detail: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        image: [{ required: true, message: '请上传商品主图', trigger: 'change' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入商品详情', trigger: 'blur' }]
      },
      editorOption: {},
      uploadHeaders: {},
      multipleSelection: []
    };
  },
  created() {
    this.fetchGoods();
    this.fetchCategories();
  },
  methods: {
    async fetchGoods() {
      const params = {};
      if (this.searchName) params.name = this.searchName;
      if (this.searchCategory) params.category_id = this.searchCategory;
      const res = await getGoods(params);
      this.goodsList = res.data.items || res.data;
    },
    async fetchCategories() {
      const res = await getCategories();
      this.categoryList = res.data;
    },
    openAddDialog() {
      this.dialogTitle = '新增商品';
      this.form = { id: null, name: '', category_id: '', image: '', price: 0, stock: 0, status: 1, detail: '' };
      this.dialogVisible = true;
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.form.image = res.data.url;
      } else {
        this.$message.error('上传失败');
      }
    },
    beforeUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGorPNG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPGorPNG && isLt2M;
    },
    openEditDialog(row) {
      this.dialogTitle = '编辑商品';
      this.form = {
        ...row,
        detail: row.description || ''
      };
      this.dialogVisible = true;
    },
    async handleSubmit() {
      console.log('submit');
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const submitData = { ...this.form, description: this.form.detail };
        if (this.form.id) {
          await updateGoods(submitData);
          this.$message.success('编辑成功');
        } else {
          await addGoods(submitData);
          this.$message.success('新增成功');
        }
        this.dialogVisible = false;
        this.fetchGoods();
      });
    },
    async deleteGoods(id) {
      await this.$confirm('确定要删除该商品吗？', '提示', { type: 'warning' });
      await deleteGoods(id);
      this.$message.success('删除成功');
      this.fetchGoods();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async batchChangeStatus(status) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择商品');
        return;
      }
      const ids = this.multipleSelection.map(item => item.id);
      await batchUpdateGoodsStatus(ids, status);
      this.$message.success('批量操作成功');
      this.fetchGoods();
    },
    async changeStatus(row) {
      // 预留上下架功能
    }
  }
};
</script>

<style scoped>
.goods-page {
  padding: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style> 