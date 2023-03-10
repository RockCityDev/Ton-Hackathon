package teleblock.ui.adapter;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.StyleSpan;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.blankj.utilcode.util.ScreenUtils;
import com.blankj.utilcode.util.SizeUtils;
import com.chad.library.adapter.base.BaseDelegateMultiAdapter;
import com.chad.library.adapter.base.delegate.BaseMultiTypeDelegate;
import com.chad.library.adapter.base.module.LoadMoreModule;
import com.chad.library.adapter.base.viewholder.BaseViewHolder;
import com.ruffian.library.widget.RTextView;
import com.ruffian.library.widget.RView;
import com.ruffian.library.widget.helper.RBaseHelper;
import com.ruffian.library.widget.helper.RTextViewHelper;

import org.jetbrains.annotations.NotNull;
import org.telegram.messenger.AndroidUtilities;
import org.telegram.messenger.DocumentObject;
import org.telegram.messenger.DownloadController;
import org.telegram.messenger.FileLoader;
import org.telegram.messenger.ImageLocation;
import org.telegram.messenger.ImageReceiver;
import org.telegram.messenger.LocaleController;
import org.telegram.messenger.MediaDataController;
import org.telegram.messenger.MessageObject;
import org.telegram.messenger.R;
import org.telegram.messenger.SvgHelper;
import org.telegram.messenger.UserConfig;
import org.telegram.messenger.browser.Browser;
import org.telegram.tgnet.TLObject;
import org.telegram.tgnet.TLRPC;
import org.telegram.ui.ActionBar.Theme;
import org.telegram.ui.ArticleViewer;
import org.telegram.ui.Components.AvatarDrawable;
import org.telegram.ui.Components.BackupImageView;
import org.telegram.ui.Components.LayoutHelper;
import org.telegram.ui.PhotoViewer;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import teleblock.telegram.channels.ChannelMessage;
import teleblock.telegram.channels.ExtendMessageType;
import teleblock.telegram.channels.GroupMediaMessage;
import teleblock.telegram.channels.JoinTimeMessage;
import teleblock.util.SystemUtil;
import teleblock.util.TGLog;
import teleblock.util.sort.MsgReactionCountSort;
import teleblock.video.KKFileDownloadStatus;
import teleblock.video.KKVideoDataManager;
import teleblock.widget.CircleProgressBar;
import teleblock.widget.ExpandableTextView;

/**
 * ?????????
 */
public class ChannelFeedRvAdapter extends BaseDelegateMultiAdapter<ChannelMessage, BaseViewHolder> implements LoadMoreModule {
    public static final int TYPE_LIST[] = {0, 1, 3, 8, 9, 10, 13};

    public static final int ITEM_TYPE_UNKNOWN = -1;//??????
    public static final int ITEM_TYPE_TEXT = 0;//??????
    public static final int ITEM_TYPE_IMAGE = 1;//??????
    public static final int ITEM_TYPE_VIDEO = 3;//??????
    public static final int ITEM_TYPE_IMAGE8 = 8;//GIF
    public static final int ITEM_TYPE_IMAGE13 = 13;//??????
    public static final int ITEM_TYPE_IMAGE100 = 100;//Photo

    public static final int ITEM_TYPE_FILE = 9;//??????
    public static final int ITEM_TYPE_TIPS = 10;//????????????

    public static final int ITEM_TYPE_GROUP_MESSAGE = ExtendMessageType.GROUP_MEDIA;//????????????
    public static final int ITEM_TYPE_GROUP_MEDIA_MESSAGE2 = ITEM_TYPE_GROUP_MESSAGE + 2;
    public static final int ITEM_TYPE_GROUP_MEDIA_MESSAGE3 = ITEM_TYPE_GROUP_MESSAGE + 3;
    public static final int ITEM_TYPE_GROUP_MEDIA_MESSAGE4 = ITEM_TYPE_GROUP_MESSAGE + 4;

    public static final int ITEM_TYPE_FORWARD = ExtendMessageType.FORWARD;//????????????
    public static final int ITEM_TYPE_JOIN_TIME = ExtendMessageType.JOIN_TIME;//???????????????????????????????????????

    Context context;

    public ChannelFeedRvAdapter(Context context) {
        this.context = context;
        initDelegate();
    }

    private void initDelegate() {
        // ????????????????????????
        setMultiTypeDelegate(new BaseMultiTypeDelegate<ChannelMessage>() {
            @Override
            public int getItemType(@NotNull List<? extends ChannelMessage> data, int position) {
                ChannelMessage message = data.get(position);
                if (message.getMessageType() == ITEM_TYPE_JOIN_TIME) {//2??????????????????
                    JoinTimeMessage joinTimeMessage = (JoinTimeMessage) message;
                    return getCommMessageType(joinTimeMessage.joinTimeMessages.get(0));
                } else if (message.getMessageType() == ITEM_TYPE_GROUP_MESSAGE) {//????????????
                    GroupMediaMessage groupMediaMessage = (GroupMediaMessage) message;
                    if (groupMediaMessage.groupMediaMessages.get(0).getMessageType() == ITEM_TYPE_FILE) {
                        return ITEM_TYPE_FILE;
                    } else {
                        if (groupMediaMessage.groupMediaMessages.size() == 2) {
                            return ITEM_TYPE_GROUP_MEDIA_MESSAGE2;
                        } else if (groupMediaMessage.groupMediaMessages.size() == 3) {
                            return ITEM_TYPE_GROUP_MEDIA_MESSAGE3;
                        } else if (groupMediaMessage.groupMediaMessages.size() >= 4) {
                            return ITEM_TYPE_GROUP_MEDIA_MESSAGE4;
                        }
                    }
                } else {
                    return getCommMessageType(message);
                }
                return ITEM_TYPE_UNKNOWN;//???????????????
            }
        });
        // ?????????????????? item ??????
        getMultiTypeDelegate()
                .addItemType(ITEM_TYPE_UNKNOWN, R.layout.view_channel_item_unknown)
                .addItemType(ITEM_TYPE_TEXT, R.layout.view_channel_item_text)
                .addItemType(ITEM_TYPE_IMAGE, R.layout.view_channel_item_image)
                .addItemType(ITEM_TYPE_VIDEO, R.layout.view_channel_item_video)
                .addItemType(ITEM_TYPE_FILE, R.layout.view_channel_item_file)
                .addItemType(ITEM_TYPE_TIPS, R.layout.view_channel_item_tips)
                .addItemType(ITEM_TYPE_FORWARD, R.layout.view_channel_item_forward)
                .addItemType(ITEM_TYPE_GROUP_MEDIA_MESSAGE2, R.layout.view_channel_item_group_media2)
                .addItemType(ITEM_TYPE_GROUP_MEDIA_MESSAGE3, R.layout.view_channel_item_group_media3)
                .addItemType(ITEM_TYPE_GROUP_MEDIA_MESSAGE4, R.layout.view_channel_item_group_media4);
    }

    private int getCommMessageType(ChannelMessage message) {
        if (message.getMessageType() == ITEM_TYPE_TEXT) {
            if (message.getMessageObject().messageOwner.media != null && message.getMessageObject().messageOwner.media.webpage != null) {
                return ITEM_TYPE_FORWARD;
            } else {
                return ITEM_TYPE_TEXT;
            }
        } else if (message.getMessageType() == ITEM_TYPE_IMAGE || message.getMessageType() == ITEM_TYPE_IMAGE8 || message.getMessageType() == ITEM_TYPE_IMAGE13 || message.getMessageType() == ITEM_TYPE_IMAGE100) {
            return ITEM_TYPE_IMAGE;
        }
        else if (message.getMessageType() == ITEM_TYPE_VIDEO) {
            return ITEM_TYPE_VIDEO;
        }
        else if (message.getMessageType() == ITEM_TYPE_FILE) {
            return ITEM_TYPE_FILE;
        } else if (message.getMessageType() == ITEM_TYPE_TIPS) {
            return ITEM_TYPE_TIPS;
        }
        return ITEM_TYPE_UNKNOWN;
    }

    @Override
    protected void convert(@NotNull BaseViewHolder baseViewHolder, ChannelMessage entity) {
        switch (baseViewHolder.getItemViewType()) {
            case ITEM_TYPE_TEXT:
                showTextItem(baseViewHolder, entity);
                break;
            case ITEM_TYPE_IMAGE:
                showImageItem(baseViewHolder, entity);
                break;
            case ITEM_TYPE_VIDEO:
                showVideoItem(baseViewHolder, entity);
                break;
            case ITEM_TYPE_FILE:
                showFileItem(baseViewHolder, entity);
                break;
            case ITEM_TYPE_FORWARD:
                showForwardtem(baseViewHolder, entity);
                break;
            case ITEM_TYPE_GROUP_MEDIA_MESSAGE2:
            case ITEM_TYPE_GROUP_MEDIA_MESSAGE3:
            case ITEM_TYPE_GROUP_MEDIA_MESSAGE4:
                showGroupMedia(baseViewHolder, entity);
                break;
            case ITEM_TYPE_TIPS:
                showTipsItem(baseViewHolder, entity);
                break;
            default:
                showUnknown(baseViewHolder, entity);
                break;
        }
    }

    public void notifyItemStatusChanged(String fileName) {
        int position = -1;
        List<ChannelMessage> list = getData();
        for (int i = 0; i < list.size(); i++) {
            ChannelMessage channelMessage = list.get(i);
            if (fileName.equals(channelMessage.getDownloadFileName())) {
                position = i;
                break;
            }
        }
        if (position > -1) {
            notifyItemChanged(position);
        }
    }

    public void showTipsItem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
    }

    //NULL
    public void showUnknown(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        TextView tv_type = baseViewHolder.findView(R.id.tv_type);
        tv_type.setText("??????????????????" + entity.getMessageType() + "\n" + entity.getMessageText());
        tv_type.setVisibility(View.GONE);
    }

    //????????????
    private void showTextItem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        showChannelBaseInfor(baseViewHolder, entity);
        //???????????????2??????????????????
        View view = baseViewHolder.findView(R.id.more_message_layout);
        checkJoinTimeMessage(entity, view);
    }

    //????????????
    private void showImageItem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        showChannelBaseInfor(baseViewHolder, entity);

        FrameLayout media_frame = baseViewHolder.findView(R.id.media_frame);

        //????????????
        int sw = ScreenUtils.getScreenWidth();
        media_frame.removeAllViews();
        media_frame.addView(getImageItemView(entity, sw, 0, true));

        //???????????????2??????????????????
        View view = baseViewHolder.findView(R.id.more_message_layout);
        checkJoinTimeMessage(entity, view);
    }

    /**
     * ?????????????????????
     * @param tv
     * @param entity
     * @param baseViewHolder
     */
    private void setMessageToText(ExpandableTextView tv, ChannelMessage entity, BaseViewHolder baseViewHolder) {

        //????????????
        String messageText;
        //???????????????????????????
        boolean txIfSpecialTreatment;
        if (baseViewHolder.getItemViewType() == ITEM_TYPE_TEXT || baseViewHolder.getItemViewType() == ITEM_TYPE_FORWARD) {
            txIfSpecialTreatment = true;
        } else {
            txIfSpecialTreatment = false;
        }

        if (baseViewHolder.getItemViewType() == ITEM_TYPE_GROUP_MEDIA_MESSAGE2
                || baseViewHolder.getItemViewType() == ITEM_TYPE_GROUP_MEDIA_MESSAGE3
                || baseViewHolder.getItemViewType() == ITEM_TYPE_GROUP_MEDIA_MESSAGE4
        ) { //????????????
            GroupMediaMessage groupMediaMessage = (GroupMediaMessage) entity;
            ChannelMessage groupEntity = groupMediaMessage.groupMediaMessages.get(groupMediaMessage.groupMediaMessages.size() - 1);
            messageText = groupEntity.getMessage();
        } else if (baseViewHolder.getItemViewType() == ITEM_TYPE_TEXT
                || baseViewHolder.getItemViewType() == ITEM_TYPE_FORWARD
        ) {
            messageText = entity.getMessageText();
        } else {
            messageText = entity.getMessage();
        }

        //?????????????????????????????????
        String showMessageTx;
        if (txIfSpecialTreatment
                && entity.getMessageObject().messageOwner.entities != null
                && entity.getMessageObject().messageOwner.entities.size() > 0
        ) { //????????????
            SpannableString spannableString = new SpannableString(messageText);
            for (TLRPC.MessageEntity tlEntity : entity.getMessageObject().messageOwner.entities) {
                if (tlEntity.offset > messageText.length() || tlEntity.offset + tlEntity.length > messageText.length()) {
                    continue;
                }
                if (!TextUtils.isEmpty(tlEntity.url)) {
                    spannableString.setSpan(new ClickableSpan() {
                        @Override
                        public void onClick(View arg0) {
                            Browser.openUrl(context, tlEntity.url, true, true);
                        }
                    }, tlEntity.offset, tlEntity.offset + tlEntity.length, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                    spannableString.setSpan(new ForegroundColorSpan(Color.parseColor("#4E9AD4")), tlEntity.offset, tlEntity.offset + tlEntity.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);//??????
                } else {
                    spannableString.setSpan(new StyleSpan(android.graphics.Typeface.BOLD), tlEntity.offset, tlEntity.offset + tlEntity.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                }
            }

            showMessageTx = spannableString.toString();
        } else { //???????????????
            showMessageTx = messageText;
        }

        if (showMessageTx.isEmpty()) {
            tv.setVisibility(View.GONE);
        } else {
            tv.setVisibility(View.VISIBLE);
            tv.setText(showMessageTx);
            tv.setMovementMethod(new LinkMovementMethod());
        }
    }

    /**
     * ????????????????????????
     * @param data
     * @param view
     */
    private void setChannelLikeListData(MsgReactionCountSort data, View view) {
        RView likeBg = view.findViewById(R.id.like_bg);
        FrameLayout flExpression = view.findViewById(R.id.fl_expression);
        TextView tvCount = view.findViewById(R.id.tv_count);

        TLRPC.TL_availableReaction r = MediaDataController.getInstance(UserConfig.selectedAccount).getReactionsMap().get(data.getVisibleReaction().emojicon);
        if (r != null) {
            //??????
            SvgHelper.SvgDrawable svgThumb = DocumentObject.getSvgThumb(r.static_icon, Theme.key_windowBackgroundGray, 1.0f);
            BackupImageView avatarImageView = new BackupImageView(context);
            avatarImageView.setImage(ImageLocation.getForDocument(r.center_icon), "44_44_lastframe", svgThumb, r);

            flExpression.removeAllViews();
            flExpression.addView(avatarImageView);
        }

        //????????????
        tvCount.setText(String.valueOf(data.getCount()));
        RBaseHelper helper = likeBg.getHelper();
        if (data.isChosen()) {
            //????????????
            helper.setBackgroundColorNormal(ContextCompat.getColor(getContext(), R.color.theme_color));
            tvCount.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
        } else {
            //??????????????????
            helper.setBackgroundColorNormal(ContextCompat.getColor(getContext(), R.color.color_E7F2FE));
            tvCount.setTextColor(ContextCompat.getColor(getContext(), R.color.theme_color));
        }
    }

    /**
     * ?????????????????? ?????? ???????????????
     * @param baseViewHolder
     * @param entity
     */
    private void showChannelBaseInfor(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        FrameLayout avatar_frame = baseViewHolder.findView(R.id.avatar_frame);
        TextView tv_channel = baseViewHolder.findView(R.id.tv_channel);
        TextView tv_time = baseViewHolder.findView(R.id.tv_time);
        TextView tv_channel_comment = baseViewHolder.findView(R.id.tv_channel_comment);
        RTextView tv_channel_share = baseViewHolder.findView(R.id.tv_channel_share);
        TextView tv_channel_views = baseViewHolder.findView(R.id.tv_channel_views);
        ExpandableTextView expandableTextView = baseViewHolder.findView(R.id.expandableTextView);

        LinearLayout rv_like_list = baseViewHolder.findView(R.id.rv_like_list);
        View channel_like_item1 = baseViewHolder.findView(R.id.channel_like_item1);
        View channel_like_item2 = baseViewHolder.findView(R.id.channel_like_item2);
        RTextView tv_channel_like = baseViewHolder.findView(R.id.tv_channel_like);

        tv_channel_like.setText(LocaleController.getString("fragment_channel_coutent_like", R.string.fragment_channel_coutent_like));
        tv_channel_share.setText(LocaleController.getString("fragment_channel_coutent_share", R.string.fragment_channel_coutent_share));

        RTextViewHelper tvHelper = tv_channel_like.getHelper();
        //????????????
        if (entity.getRepliesCount() != 0) {
            tv_channel_comment.setText(LocaleController.getString("fragment_channel_coutent_comments", R.string.fragment_channel_coutent_comments) + "(" + entity.getRepliesCount() + ")");
        } else {
            tv_channel_comment.setText(LocaleController.getString("fragment_channel_coutent_comments", R.string.fragment_channel_coutent_comments));
        }

        //??????????????????
        setMessageToText(expandableTextView, entity, baseViewHolder);

        //????????????
        tv_channel_views.setText(entity.getViewNumber() + "");

        //???????????????????????????????????????
        tvHelper.setTextColorNormal(Color.parseColor("#868686"));
        tvHelper.setIconNormalLeft(ContextCompat.getDrawable(getContext(), R.drawable.icon_thumb_channel_off));

        if (entity.getMessageObject().messageOwner.reactions == null
                || entity.getMessageObject().messageOwner.reactions.results == null
                || entity.getMessageObject().messageOwner.reactions.results.isEmpty()) {
            rv_like_list.setVisibility(View.GONE);
        } else {
            rv_like_list.setVisibility(View.VISIBLE);
            List<MsgReactionCountSort> likeData = new ArrayList<>();
            for (TLRPC.ReactionCount data : entity.getMessageObject().messageOwner.reactions.results) {
                likeData.add(new MsgReactionCountSort(data.chosen, data.reaction, data.count));
            }

            //???????????????????????????
            Collections.sort(likeData);

            //??????????????????????????????????????????????????????????????????
            for (MsgReactionCountSort itemData: likeData) {
                if (itemData.isChosen()) {
                    tvHelper.setTextColorNormal(Color.parseColor("#72D0F1"));
                    tvHelper.setIconNormalLeft(ContextCompat.getDrawable(getContext(), R.drawable.icon_thumb_channel_on));
                }
            }

            if (likeData.size() > 2) {
                likeData = likeData.subList(0, 2);
            }

            if (likeData.size() == 2) {
                channel_like_item2.setVisibility(View.VISIBLE);
                setChannelLikeListData(likeData.get(0), channel_like_item1);
                setChannelLikeListData(likeData.get(1), channel_like_item2);
            } else if (likeData.size() == 1) {
                channel_like_item2.setVisibility(View.GONE);
                setChannelLikeListData(likeData.get(0), channel_like_item1);
            }
        }

        //channel??????
        TLRPC.Chat chat = KKVideoDataManager.getInstance().getChat(entity.getDialogId());
        if (chat != null) {
            AvatarDrawable avatarDrawable = new AvatarDrawable();
            BackupImageView avatarImageView = new BackupImageView(context);
            avatarDrawable.setInfo(chat);
            if (avatarImageView != null) {
                avatarImageView.setRoundRadius(AndroidUtilities.dp(44));
                avatarImageView.setImage(ImageLocation.getForChat(chat, ImageLocation.TYPE_SMALL), "22_22", avatarDrawable, chat);
            }
            avatar_frame.removeAllViews();
            avatar_frame.addView(avatarImageView);
        }

        //?????????
        if (!TextUtils.isEmpty(entity.getFromName())) {
            tv_channel.setVisibility(View.VISIBLE);
            tv_channel.setText(entity.getFromName());
        } else {
            tv_channel.setVisibility(View.GONE);
        }

        //??????
        SimpleDateFormat formatter = new SimpleDateFormat(LocaleController.getString("dateformat3", R.string.dateformat3));
        long time = entity.getMessageObject().messageOwner.date;
        String formatDate = formatter.format(time * 1000);
        tv_time.setText(formatDate);
    }

    //????????????
    private void showVideoItem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        showChannelBaseInfor(baseViewHolder, entity);
//        TextView tv_channel_collect = baseViewHolder.findView(R.id.tv_channel_collect);
        FrameLayout media_frame = baseViewHolder.findView(R.id.media_frame);

        //??????????????????
        int sw = ScreenUtils.getScreenWidth();
        media_frame.removeAllViews();
        media_frame.addView(getVideoItemView(entity, sw, 0, true), LayoutHelper.createFrame(LayoutHelper.WRAP_CONTENT, LayoutHelper.WRAP_CONTENT, Gravity.CENTER));

//        //????????????
//        boolean collect = KKFileMessageCollectManager.getInstance().getCollectStatus(entity.messageObject);
//        setDrawableLeft(tv_channel_collect, collect);

        //???????????????2??????????????????
        View view = baseViewHolder.findView(R.id.more_message_layout);
        checkJoinTimeMessage(entity, view);
    }

//    //????????????
//    private void setDrawableLeft(TextView textView, boolean collect) {
//        Drawable drawable;
//        if (collect) {
//            drawable = context.getResources().getDrawable(R.drawable.ic_channel_collected);
//        } else {
//            drawable = context.getResources().getDrawable(R.drawable.ic_channel_collect);
//        }
//        //?????????????????????,??????????????????.
//        drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
//        textView.setCompoundDrawables(drawable, null, null, null);
//    }

    //????????????
    private void showFileItem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        showChannelBaseInfor(baseViewHolder, entity);
        LinearLayout file_frame = baseViewHolder.findView(R.id.file_frame);

        //????????????
        setFileItemView(entity, file_frame);

        //???????????????2??????????????????
        View view = baseViewHolder.findView(R.id.more_message_layout);
        checkJoinTimeMessage(entity, view);
    }

    //??????
    private void showForwardtem(BaseViewHolder baseViewHolder, ChannelMessage entity) {
        showChannelBaseInfor(baseViewHolder, entity);
        LinearLayout forward_frame = baseViewHolder.findView(R.id.forward_frame);
        FrameLayout forward_image = baseViewHolder.findView(R.id.forward_image);
        LinearLayout forward_text_layout = baseViewHolder.findView(R.id.forward_text_layout);
        TextView tv_forward_title = baseViewHolder.findView(R.id.tv_forward_title);
        TextView tv_forward_content = baseViewHolder.findView(R.id.tv_forward_content);
        forward_frame.setVisibility(View.GONE);
        if (entity.getMessageObject().messageOwner.media != null && entity.getMessageObject().messageOwner.media.webpage != null) {
            forward_frame.setVisibility(View.VISIBLE);
            forward_frame.setOnClickListener(view -> {
                if (entity.getMessageObject().messageOwner.media.webpage.cached_page != null) {
                    ArticleViewer.getInstance().setParentActivity((Activity) context, null);
                    ArticleViewer.getInstance().open(entity.getMessageObject());
                } else {
                    String url = entity.getMessageObject().messageOwner.media.webpage.url;
                    if (!TextUtils.isEmpty(url)) {
                        Browser.openUrl((Activity) context, url, true, true);
                    }
                }
            });
            //???????????????
            forward_image.setVisibility(View.GONE);
            if (entity.getMessageObject().messageOwner.media.webpage.photo != null) {
                forward_image.setVisibility(View.VISIBLE);
                MessageObject object = entity.getMessageObject();
                TLRPC.Photo photo = entity.getMessageObject().messageOwner.media.webpage.photo;
                //????????????
                ArrayList<TLRPC.PhotoSize> photoSizeArr = photo.sizes;
                if (photoSizeArr != null && photoSizeArr.size() > 0) {
                    TLRPC.PhotoSize currentPhotoObject = photoSizeArr.get(photoSizeArr.size() - 1);//???????????????
                    TLRPC.PhotoSize currentPhotoObjectThumb = photoSizeArr.get(0);

                    // object.photoThumbsObject
                    TLObject photoParentObject = photo;
                    int w = photoSizeArr.get(photoSizeArr.size() - 1).w;
                    int h = photoSizeArr.get(photoSizeArr.size() - 1).h;
                    int viewW = ScreenUtils.getScreenWidth() - SizeUtils.dp2px(32f);
                    int viewH = 178;
                    if (w != 0 && h != 0) {
                        viewH = h * viewW / w;
                        int maxH = SizeUtils.dp2px(178f);
                        if (viewH >= maxH) {//??????????????????
                            viewH = maxH;
                        }
                    }
                    LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) forward_image.getLayoutParams();
                    params.width = viewW;
                    params.height = viewH;
                    forward_image.setLayoutParams(params);

                    BackupImageView bImageView = new BackupImageView(context);
                    bImageView.setRoundRadius(AndroidUtilities.dp(4), AndroidUtilities.dp(4), 0, 0);
                    bImageView.getImageReceiver().setNeedsQualityThumb(currentPhotoObject == null);
                    bImageView.getImageReceiver().setShouldGenerateQualityThumb(currentPhotoObject == null);
                    ImageReceiver photoImage = bImageView.getImageReceiver();
                    boolean photoExist = true;
                    String fileName = FileLoader.getAttachFileName(currentPhotoObject);
                    if (object.mediaExists) {
                        //DownloadController.getInstance(currentAccount).removeLoadingFileObserver(this);
                    } else {
                        photoExist = false;
                    }
                    if (photoExist || !object.loadingCancelled && DownloadController.getInstance(UserConfig.selectedAccount).canDownloadMedia(object) || FileLoader.getInstance(UserConfig.selectedAccount).isLoadingFile(fileName)) {
                        photoImage.setImage(ImageLocation.getForObject(currentPhotoObject, photoParentObject), null, ImageLocation.getForObject(currentPhotoObjectThumb, photoParentObject), null, currentPhotoObject.size, null, object, object.shouldEncryptPhotoOrVideo() ? 2 : 0);
                    } else {
                        if (currentPhotoObjectThumb != null) {
                            photoImage.setImage(null, null, ImageLocation.getForObject(currentPhotoObjectThumb, photoParentObject), null, 0, null, object, object.shouldEncryptPhotoOrVideo() ? 2 : 0);
                        } else {
                            photoImage.setImageBitmap((Drawable) null);
                        }
                    }
                    forward_image.addView(bImageView);
                }
            }

            forward_text_layout.setVisibility(View.GONE);
            //????????????
            String forwardTitle = entity.getMessageObject().messageOwner.media.webpage.title;
            if (!TextUtils.isEmpty(forwardTitle)) {
                forward_text_layout.setVisibility(View.VISIBLE);
                tv_forward_title.setText(forwardTitle);
                TextPaint tp = tv_forward_title.getPaint();
                tp.setFakeBoldText(true);
            }

            //????????????
            String forwardContent = entity.getMessageObject().messageOwner.media.webpage.description;
            if (!TextUtils.isEmpty(forwardContent)) {
                forward_text_layout.setVisibility(View.VISIBLE);
                tv_forward_content.setText(forwardContent);
            }

            //???????????????2??????????????????
            View view = baseViewHolder.findView(R.id.more_message_layout);
            checkJoinTimeMessage(entity, view);
        }
    }

    //????????????
    private void showGroupMedia(BaseViewHolder baseViewHolder, ChannelMessage message) {
        showChannelBaseInfor(baseViewHolder, message);
        FrameLayout media_frame = baseViewHolder.findView(R.id.media_frame);

        //mediaView
        setGroupMediaView(message, media_frame);
    }

    //??????item
    private void setFileItemView(ChannelMessage entity, View fileItem) {
        ImageView iv_centerimg = fileItem.findViewById(R.id.iv_centerimg);
        ProgressBar loading_view = fileItem.findViewById(R.id.loading_view);
        CircleProgressBar circle_progress = fileItem.findViewById(R.id.circle_progress);

        TextView tv_file_name = fileItem.findViewById(R.id.tv_file_name);
        TextView tv_file_size = fileItem.findViewById(R.id.tv_file_size);
        tv_file_name.setText(entity.getFileName());
        tv_file_size.setText(SystemUtil.getSizeFormat(entity.getSize()));

        //??????
        iv_centerimg.setVisibility(View.VISIBLE);
        loading_view.setVisibility(View.GONE);
        circle_progress.setVisibility(View.GONE);

        if (entity.downloadStatus != null) {
            //????????????
            int pro = (int) (entity.downloadStatus.getDownloadedSize() * 1.00 / entity.downloadStatus.getTotalSize() * 100);

            if (entity.downloadStatus.getStatus() == KKFileDownloadStatus.Status.DOWNLOADED) {//?????????
                iv_centerimg.setImageResource(R.drawable.ic_file_downloaded);
            } else if (entity.downloadStatus.getStatus() == KKFileDownloadStatus.Status.NOT_START) {//?????????
                iv_centerimg.setImageResource(R.drawable.ic_file_nostart);
            } else if (entity.downloadStatus.getStatus() == KKFileDownloadStatus.Status.DOWNLOADING) {//?????????
                iv_centerimg.setImageResource(R.drawable.ic_file_download_parse);
                if (entity.downloadStatus.getDownloadedSize() == 0) {//loadingView
                    loading_view.setVisibility(View.VISIBLE);
                } else {
                    circle_progress.setVisibility(View.VISIBLE);
                    circle_progress.setProgress(pro);
                }
            } else if (entity.downloadStatus.getStatus() == KKFileDownloadStatus.Status.PAUSE) {//?????????
                iv_centerimg.setImageResource(R.drawable.ic_file_nostart);
                circle_progress.setVisibility(View.VISIBLE);
                circle_progress.setProgress(pro);
            } else if (entity.downloadStatus.getStatus() == KKFileDownloadStatus.Status.FAILED) {//?????????
                iv_centerimg.setImageResource(R.drawable.ic_file_nostart);
            }
        }
    }

    private PhotoViewer.PhotoViewerProvider photoViewerProvider = new PhotoViewer.EmptyPhotoViewerProvider() {
        @Override
        public PhotoViewer.PlaceProviderObject getPlaceForPhoto(MessageObject messageObject, TLRPC.FileLocation fileLocation, int index, boolean needPreview) {
            return null;
        }
    };

    //??????Item
    private View getVideoItemView(ChannelMessage entity) {
        return getVideoItemView(entity, 0, 0, false);
    }

    private View getVideoItemView(ChannelMessage entity, int viewW, int viewH, boolean single) {
        View view = LayoutInflater.from(context).inflate(R.layout.view_channel_item_video_child, null);
        view.setOnClickListener(tView -> {
            PhotoViewer.getInstance().setParentActivity((Activity) context);
            PhotoViewer.getInstance().openPhoto(entity.messageObject, null, -entity.chat.id, 0,0, photoViewerProvider);
        });
        FrameLayout image_layout = view.findViewById(R.id.image_layout);
        FrameLayout blurry_image_layout = view.findViewById(R.id.blurry_image_layout);
        TextView tv_size = view.findViewById(R.id.tv_size);
        TextView tv_length = view.findViewById(R.id.tv_length);

        //??????????????????
        TLRPC.Document document = entity.getMessageObject().getDocument();
        if (document != null) {
            ArrayList<TLRPC.DocumentAttribute> attributes = document.attributes;
            if (attributes != null && attributes.size() > 0) {
                int w = attributes.get(0).w;
                int h = attributes.get(0).h;
                if (w != 0 && h != 0) {
                    if (viewW == 0) {
                        viewW = w * viewH / h;
                    } else if (viewH == 0) {
                        viewH = h * viewW / w;
                        if (h >= w) {//?????????????????????
                            int maxH = SizeUtils.dp2px(360f);
                            if (viewH >= maxH) {
                                viewH = maxH;
                                viewW = w * viewH / h;
                            }
                        }
                    }
                }
            }
            if (viewH == 0) viewH = 320;
            if (viewW == 0) viewW = 320;

            RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            if (single) {//?????????????????????????????????????????????????????????????????????????????????????????? MATCH_PARENT
                params.width = viewW;
                params.height = viewH;
            }
            params.addRule(RelativeLayout.CENTER_IN_PARENT);
            image_layout.setLayoutParams(params);

            //????????????
            BackupImageView ivThumb = new BackupImageView(context);
            if (document.thumbs != null) {
                TLRPC.PhotoSize bigthumb = FileLoader.getClosestPhotoSizeWithSize(entity.getMessageObject().getDocument().thumbs, 320);
                TLRPC.PhotoSize thumb = FileLoader.getClosestPhotoSizeWithSize(entity.getMessageObject().getDocument().thumbs, 40);
                if (thumb == bigthumb) {
                    bigthumb = null;
                }
                //ivThumb.setRoundRadius(AndroidUtilities.dp(6), AndroidUtilities.dp(8), AndroidUtilities.dp(4), AndroidUtilities.dp(4));
                ivThumb.getImageReceiver().setNeedsQualityThumb(bigthumb == null);
                ivThumb.getImageReceiver().setShouldGenerateQualityThumb(bigthumb == null);
                ivThumb.setImage(ImageLocation.getForDocument(bigthumb, entity.getMessageObject().getDocument()), null, ImageLocation.getForDocument(thumb, entity.getMessageObject().getDocument()), null, null, 0, 1, entity.getMessageObject());
                if (image_layout.getChildCount() == 0) {
                    image_layout.addView(ivThumb);
                }
            }
        }
        //??????
        tv_size.setText(SystemUtil.getSizeFormat(entity.getSize()));
        //??????
        tv_length.setText(SystemUtil.timeTransfer(entity.getMediaDuration()));
        return view;
    }

    //?????????Item
    private View getImageItemView(List<ChannelMessage> groupMediaMessages, ChannelMessage entity) {
        return getImageItemView(groupMediaMessages, entity, 0, 0, false);
    }

    //?????????Item
    private View getImageItemView(ChannelMessage entity, int viewW, int viewH, boolean sigle) {
        return getImageItemView(null, entity, viewW, viewH, sigle);
    }

    private View getImageItemView(List<ChannelMessage> groupMediaMessages,ChannelMessage entity, int viewW, int viewH, boolean sigle) {
        View view = LayoutInflater.from(context).inflate(R.layout.view_channel_item_image_child, null);
        view.setOnClickListener(tView -> {
            PhotoViewer.getInstance().setParentActivity((Activity) context);
            if (groupMediaMessages != null) {//??????
                ArrayList<MessageObject> list = new ArrayList<>();
                for (ChannelMessage channelMessage : groupMediaMessages) {
                    list.add(channelMessage.messageObject);
                }
                PhotoViewer.getInstance().openPhoto(list, groupMediaMessages.indexOf(entity), -entity.chat.id, 0,0, photoViewerProvider);
                return;
            }
            PhotoViewer.getInstance().openPhoto(entity.messageObject, null, -entity.chat.id, 0,0, photoViewerProvider);
        });
        FrameLayout image_layout = view.findViewById(R.id.image_layout);
        MessageObject object = entity.getMessageObject();

        //????????????
        ArrayList<TLRPC.PhotoSize> photoSizeArr = object.photoThumbs;
        if (photoSizeArr != null && photoSizeArr.size() > 0) {
            TLRPC.PhotoSize currentPhotoObject = photoSizeArr.get(photoSizeArr.size() - 1);//???????????????
            TLRPC.PhotoSize currentPhotoObjectThumb = photoSizeArr.get(0);
            TLObject photoParentObject = object.photoThumbsObject;
            int w = photoSizeArr.get(photoSizeArr.size() - 1).w;
            int h = photoSizeArr.get(photoSizeArr.size() - 1).h;
            if (w != 0 && h != 0) {
                if (viewW == 0) {
                    viewW = w * viewH / h;
                } else if (viewH == 0) {
                    viewH = h * viewW / w;
                    if (h >= w) {//?????????????????????
                        int maxH = SizeUtils.dp2px(360f);
                        if (viewH >= maxH) {
                            viewH = maxH;
                            viewW = w * viewH / h;
                        }
                    }
                }
            }
            RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            if (sigle) {
                params.width = viewW;
                params.height = viewH;
                if (viewH > viewW) {
                    //params.setMargins(SizeUtils.dp2px(16f), 0, 0, 0);
                }
                params.addRule(RelativeLayout.CENTER_IN_PARENT);//????????????
            } else {//??????-??????????????? - ???????????????????????????
                params.addRule(RelativeLayout.CENTER_IN_PARENT);
            }
            image_layout.setLayoutParams(params);


            BackupImageView bImageView = new BackupImageView(context);
            bImageView.setBackgroundColor(Color.parseColor("#30999999"));
            bImageView.getImageReceiver().setNeedsQualityThumb(currentPhotoObject == null);
            bImageView.getImageReceiver().setShouldGenerateQualityThumb(currentPhotoObject == null);
            ImageReceiver photoImage = bImageView.getImageReceiver();
            boolean photoExist = true;
            String fileName = FileLoader.getAttachFileName(currentPhotoObject);
            if (object.mediaExists) {
                //DownloadController.getInstance(currentAccount).removeLoadingFileObserver(this);
            } else {
                photoExist = false;
            }
            if (photoExist || !object.loadingCancelled && DownloadController.getInstance(UserConfig.selectedAccount).canDownloadMedia(object) || FileLoader.getInstance(UserConfig.selectedAccount).isLoadingFile(fileName)) {
                photoImage.setImage(ImageLocation.getForObject(currentPhotoObject, photoParentObject), null, ImageLocation.getForObject(currentPhotoObjectThumb, photoParentObject), null, currentPhotoObject.size, null, object, object.shouldEncryptPhotoOrVideo() ? 2 : 0);
            } else {
                if (currentPhotoObjectThumb != null) {
                    photoImage.setImage(null, null, ImageLocation.getForObject(currentPhotoObjectThumb, photoParentObject), null, 0, null, object, object.shouldEncryptPhotoOrVideo() ? 2 : 0);
                } else {
                    photoImage.setImageBitmap((Drawable) null);
                }
            }
            image_layout.addView(bImageView);
        }
        return view;
    }

    //??????Item
    private void setGroupMediaView(ChannelMessage message11, View groupView) {
        GroupMediaMessage groupMediaMessage = (GroupMediaMessage) message11;
        int h[] = new int[0];
        if (groupMediaMessage.groupMediaMessages.size() == 2) {
            h = new int[]{180, 180};
        } else if (groupMediaMessage.groupMediaMessages.size() == 3) {
            h = new int[]{240, 120, 120};
        } else if (groupMediaMessage.groupMediaMessages.size() >= 4) {
            h = new int[]{227, 127, 100, 100};
        }
        FrameLayout vw1 = groupView.findViewById(R.id.vw1);
        FrameLayout vw2 = groupView.findViewById(R.id.vw2);
        FrameLayout vw3 = groupView.findViewById(R.id.vw3);
        FrameLayout vw4 = groupView.findViewById(R.id.vw4);
        TextView tv_more_num = groupView.findViewById(R.id.tv_more_num);

        for (int i = 0; i < groupMediaMessage.groupMediaMessages.size(); i++) {
            View mediaView = null;
            ChannelMessage channelMessage = groupMediaMessage.groupMediaMessages.get(i);
            if (channelMessage.getMessageType() == ITEM_TYPE_IMAGE) {
                mediaView = getImageItemView(groupMediaMessage.groupMediaMessages,channelMessage);
            }
            else if (channelMessage.getMessageType() == ITEM_TYPE_VIDEO) {
                mediaView = getVideoItemView(channelMessage);
            }
            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);
            params.gravity = Gravity.CENTER;
            if (mediaView != null) {
                if (i == 0) {
                    vw1.addView(mediaView, params);
                } else if (i == 1) {
                    vw2.addView(mediaView, params);
                } else if (i == 2) {
                    vw3.addView(mediaView, params);
                } else if (i == 3) {
                    vw4.addView(mediaView, params);
                }
            }
        }
        if (tv_more_num != null) {
            if (groupMediaMessage.groupMediaMessages.size() > 4) {
                tv_more_num.setVisibility(View.VISIBLE);
                tv_more_num.setText("+" + (groupMediaMessage.groupMediaMessages.size() - 4));
            } else {
                tv_more_num.setVisibility(View.GONE);
            }
        }
    }

//    //??????????????????
//    public void updateCollectStatus(BaseViewHolder baseViewHolder, ChannelMessage message) {
//        boolean collect = KKFileMessageCollectManager.getInstance().getCollectStatus(message.getMessageObject());
//        if (collect) {
//            KKFileMessageCollectManager.getInstance().removeCollect(message.getMessageObject());
//        } else {
//            KKFileMessageCollectManager.getInstance().collectMessage(message.getMessageObject());
//        }
//        TextView tv_video_collect = baseViewHolder.findView(R.id.tv_channel_collect);
//        setDrawableLeft(tv_video_collect, !collect);
//    }

    //2??????????????????
    private void checkJoinTimeMessage(ChannelMessage channelMessage, View view) {
        if (channelMessage.getMessageType() != ITEM_TYPE_JOIN_TIME) {
            view.setVisibility(View.GONE);
            return;
        }
        JoinTimeMessage message = (JoinTimeMessage) channelMessage;
        if (message.messageExpand) {
            view.setVisibility(View.GONE);
            return;
        }
        view.setVisibility(View.VISIBLE);
        FrameLayout avatar_frame = view.findViewById(R.id.more_head_frame);
        TextView textView = view.findViewById(R.id.tv_more_message);

        //??????
        TLRPC.Chat chat = KKVideoDataManager.getInstance().getChat(message.getDialogId());
        if (chat != null) {
            AvatarDrawable avatarDrawable = new AvatarDrawable();
            BackupImageView avatarImageView = new BackupImageView(context);
            avatarDrawable.setInfo(chat);
            if (avatarImageView != null) {
                avatarImageView.setRoundRadius(AndroidUtilities.dp(20));
                avatarImageView.setImage(ImageLocation.getForChat(chat, ImageLocation.TYPE_SMALL), "44_44", avatarDrawable, chat);
            }
            avatar_frame.removeAllViews();
            avatar_frame.addView(avatarImageView);
        }

        //????????????
        String string = LocaleController.getString("channel_more_message_format", R.string.channel_more_message_format) + "";
        String formatStr = String.format(string, message.joinTimeMessages.size() - 1);
        textView.setText(formatStr);
    }
}
