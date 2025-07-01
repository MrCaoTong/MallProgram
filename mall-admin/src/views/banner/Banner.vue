<template>
  <div class="banner-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>轮播图管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">新增轮播图</el-button>
      </div>
      <el-table :data="bannerList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" style="width: 100px; height: 50px" fit="cover" :preview-src-list="[scope.row.image]"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="跳转链接"></el-table-column>
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
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="图片" prop="image">
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
import { getBanners, addBanner, updateBanner, deleteBanner, updateBannerStatus } from '@/api/banner';

export default {
  name: 'Banner',
  data() {
    return {
      bannerList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        title: '',
        image: '',
        link: '',
        sort: 0,
        status: 1
      },
    };
  },
  created() {
    this.fetchBanners();
  },
  methods: {
    getImageUrl(relativePath) {
      return relativePath;
    },
    async fetchBanners() {
      const res = await getBanners();
      this.bannerList = res.data;
    },
    handleAdd() {
      this.dialogTitle = '新增轮播图';
      this.form = { id: null, title: '', image: '', link: '', sort: 0, status: 1 };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑轮播图';
      this.form = { ...row };
      this.dialogVisible = true;
    },
    async handleDelete(id) {
      await deleteBanner(id);
      this.$message.success('删除成功');
      this.fetchBanners();
    },
    async handleStatusChange(row) {
      await updateBannerStatus(row.id, row.status);
      this.$message.success('状态更新成功');
    },
    async handleSubmit() {
      if (this.form.id) {
        await updateBanner(this.form);
        this.$message.success('更新成功');
      } else {
        await addBanner(this.form);
        this.$message.success('新增成功');
      }
      this.dialogVisible = false;
      this.fetchBanners();
    },
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.form.image = res.data.url;
      } else {
        this.$message.error('上传失败');
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style>
.banner-page {
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