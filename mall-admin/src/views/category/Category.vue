<template>
  <div class="category-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品分类管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">新增分类</el-button>
      </div>
      <el-table :data="categoryList" border row-key="id" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image v-if="scope.row.image" :src="scope.row.image" style="width: 50px; height: 50px" fit="cover" :preview-src-list="[scope.row.image]"></el-image>
            <span v-else>无图</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 10px;">
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="分类图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            with-credentials>
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllCategories, addCategory, updateCategory, deleteCategory, updateCategoryStatus } from '@/api/category';

export default {
  name: 'Category',
  data() {
    return {
      categoryList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: '',
        image: '',
        sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      const res = await getAllCategories();
      this.categoryList = res.data;
    },
    handleAdd() {
      this.dialogTitle = '新增分类';
      this.form = { id: null, name: '', image: '', sort: 0, status: 1 };
      this.dialogVisible = true;
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    handleEdit(row) {
      this.dialogTitle = '编辑分类';
      this.form = { ...row };
      this.dialogVisible = true;
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    async handleDelete(id) {
      await deleteCategory(id);
      this.$message.success('删除成功');
      this.fetchCategories();
    },
    async handleStatusChange(row) {
      await updateCategoryStatus(row.id, row.status);
      this.$message.success('状态更新成功');
    },
    handleSubmit() {
        this.$refs.form.validate(async (valid) => {
            if (valid) {
                if (this.form.id) {
                    await updateCategory(this.form);
                    this.$message.success('更新成功');
                } else {
                    await addCategory(this.form);
                    this.$message.success('新增成功');
                }
                this.dialogVisible = false;
                this.fetchCategories();
            }
        });
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
    }
  }
}
</script>

<style>
.category-page {
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 