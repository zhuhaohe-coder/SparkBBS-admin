<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="700px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <div class="comment-list">
        <div
          class="comment-item"
          v-for="(item, index) in commentList"
          :key="index"
        >
          <div class="p-comment-list">
            <Avatar :userId="item.userId" :size="40"></Avatar>
            <div class="content-info">
              <a
                :href="proxy.globalInfo.webDomain + '/user/' + item.userId"
                class="a-link"
                target="_blank"
                >{{ item.nickName }}</a
              >
              <div class="comment-content" v-html="item.content"></div>
              <div v-if="item.imgPath">
                <CommentImage
                  :src="
                    proxy.globalInfo.imageUrl + item.imgPath.replace('.', '_.')
                  "
                  :image-list="[proxy.globalInfo.imageUrl + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                发布: <span>{{ item.postTime }}</span>
                <span>{{ item.userIpAddress }}</span>
                赞: <span>{{ item.goodCount }}</span>
              </div>
              <div v-if="item.children">
                <div
                  class="s-comment-item"
                  v-for="(sub, index) in item.children"
                  :key="index"
                >
                  <Avatar :userId="sub.userId" :size="40"></Avatar>
                  <a
                    :href="proxy.globalInfo.webDomain + '/user/' + sub.userId"
                    class="a-link"
                    target="_blank"
                    >{{ sub.nickName }}</a
                  >
                  <span v-if="sub.replyUserId"
                    >回复
                    <a
                      :href="
                        proxy.globalInfo.webDomain + '/user/' + sub.replyUserId
                      "
                      class="a-link"
                      target="_blank"
                      >{{ sub.replyNickName }}</a
                    ></span
                  >
                  <div class="comment-content" v-html="sub.content"></div>
                  <div class="post-info">
                    发布: <span>{{ sub.postTime }}</span>
                    <span>{{ sub.userIpAddress }}</span>
                    赞: <span>{{ sub.goodCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList?.length === 0">暂无评论</div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import CommentImage from "./CommentImage.vue";
const { proxy } = getCurrentInstance();
const dialogConfig = reactive({
  show: false,
  title: "评论详情",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});
const api = {
  loadComment: "/forum/loadComment4Article",
};
const commentList = ref(null);
const show = async (articleId) => {
  dialogConfig.show = true;
  const result = await proxy.Request({
    url: api.loadComment,
    params: {
      articleId,
    },
  });
  if (!result) return;
  commentList.value = result.data;
};
defineExpose({ show });
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    .p-comment-list {
      display: flex;
    }
    .content-info {
      margin-left: 5px;
    }
    .comment-content {
      margin: 5px 0px;
    }
    .post-info {
      font-size: 12px;
      color: rgb(135, 130, 130);
      span {
        margin-right: 15px;
      }
    }
    .s-comment-item {
      display: flex;
      margin-top: 10px;
      align-items: center;
    }
  }
}
</style>
