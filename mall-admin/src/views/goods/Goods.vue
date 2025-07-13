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
      <div style="overflow-x: auto;">
        <el-table :data="goodsList" border @selection-change="handleSelectionChange" style="min-width: 1200px;">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="image" label="图片" width="100">
            <template slot-scope="scope">
              <el-image :src="getImageUrl(scope.row.image)" style="width: 80px; height: 80px;" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column prop="stock" label="库存" width="80" />
          <el-table-column prop="category_name" label="所属分类" />
          <el-table-column prop="status" label="上架状态" width="100">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.category_status === 0" content="该分类已被禁用，需要将该商品分类打开，才能上架" placement="top">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" :disabled="true" @change="changeStatus(scope.row)" />
              </el-tooltip>
              <el-switch v-else v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="is_recommend" label="推荐" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_recommend"
                :active-value="1"
                :inactive-value="0"
                @change="val => handleRecommendChange(scope.row, val)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteGoods(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增/编辑商品弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="max-height:60vh;overflow-y:auto;" class="goods-dialog-form">
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
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :headers="uploadHeaders"
            with-credentials>
            <img v-if="form.image" :src="getImageUrl(form.image)" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="0.01" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" class="form-sort-item">
          <el-input-number v-model="form.sort" :min="0" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="上架状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <quill-editor v-model="form.detail" :options="editorOption" style="height:120px; max-width: 100%;" />
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
import { getGoods, addGoods, updateGoods, deleteGoods, batchUpdateGoodsStatus, updateGoodsStatus, updateRecommend } from '@/api/goods';
import { getCategories } from '@/api/category';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import config from '@/config';
import { getImageUrl } from '@/utils/util';

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
      apiUrl: config.apiUrl,
      form: {
        id: null,
        name: '',
        category_id: '',
        image: '',
        price: 0,
        stock: 0,
        status: 1,
        detail: '',
        sort: 0
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
  computed: {
    uploadUrl() {
      return `${this.apiUrl}/api/admin/upload`;
    }
  },
  created() {
    console.log('Goods.vue getImageUrl test:', getImageUrl('/uploads/test.png'));
    this.fetchGoods();
    this.fetchCategories();
  },
  methods: {
    getImageUrl,
    async fetchGoods() {
      const params = {};
      if (this.searchName) params.name = this.searchName;
      if (this.searchCategory) params.category_id = this.searchCategory;
      const res = await getGoods(params);
      this.goodsList = res.data.items || res.data;
    },
    async fetchCategories() {
      // 获取启用分类
      const res = await getCategories();
      let categories = res.data || [];
      // 如果是编辑商品，且当前商品分类不在启用分类中
      if (this.form.id && this.form.category_id && !categories.find(c => c.id === this.form.category_id)) {
        // 额外查出该分类
        try {
          const resp = await this.$axios({
            url: `/admin/category/all`,
            method: 'get'
          });
          const allCats = resp.data.data || [];
          const disabledCat = allCats.find(c => c.id === this.form.category_id);
          if (disabledCat) {
            categories.push({ ...disabledCat, name: disabledCat.name + '（已禁用）' });
          }
        } catch (e) {}
      }
      this.categoryList = categories;
    },
    openAddDialog() {
      this.dialogTitle = '新增商品';
      this.form = { id: null, name: '', category_id: '', image: '', price: 0, stock: 0, status: 1, detail: '', sort: 0 };
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
      try {
        await batchUpdateGoodsStatus(ids, status);
        this.$message.success('批量操作成功');
        this.fetchGoods();
      } catch (e) {
        this.$message.error((e.response && e.response.data && e.response.data.message) || '批量操作失败');
      }
    },
    async changeStatus(row) {
      try {
        // 只处理上架/下架
        await updateGoodsStatus(row.id, row.status);
        this.$message.success('状态更新成功');
      } catch (e) {
        // 回滚状态
        row.status = row.status === 1 ? 0 : 1;
        this.$message.error((e.response && e.response.data && e.response.data.message) || '操作失败');
      }
    },
    async handleRecommendChange(row, val) {
      try {
        await updateRecommend({ id: row.id, is_recommend: val });
        this.$message.success('修改成功');
        this.fetchGoods();
      } catch (e) {
        this.$message.error((e.response && e.response.data && (e.response.data.msg || e.response.data.message)) || '操作失败');
        // 回滚 UI 状态
        row.is_recommend = !val;
      }
    },
    async updateSort(row) {
      await updateGoods({ id: row.id, sort: row.sort });
      this.$message.success('排序已更新');
      this.fetchGoods();
    }
  }
};
</script>

<style>
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
.form-sort-item {
  margin-top: 0;
}
.goods-dialog-form .el-form-item {
  width: 100%;
}
</style> 