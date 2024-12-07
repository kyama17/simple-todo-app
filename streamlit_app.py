import streamlit as st
import streamlit.components.v1 as components

st.title("🎈 My new app")
st.write(
    "Let's start building! For help and inspiration, head over to [docs.streamlit.io](https://docs.streamlit.io/)."
)


# 処理内容のサンプル
st.write("処理完了時に音を鳴らすデモ")

if st.button("処理開始"):
    with st.spinner("処理中..."):
        # サンプル処理（ここで時間がかかる処理を実行）
        import time
        time.sleep(3)  # 3秒待つ

    st.success("処理が完了しました！")

    # 音を鳴らすJavaScriptコードを埋め込む
    components.html(
        """
        <script>
        var audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
        audio.play();
        </script>
        """,
        unsafe_allow_html=True,
    )
