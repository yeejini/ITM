"use server";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PollyClient,SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

const bucket = process.env.BUCKET_NAME;
const s3_client = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const polly_client = new PollyClient({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const createPresignedUrlWithClient = async (key) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key.replace(`s3://${bucket}/`, "")});
  return getSignedUrl(s3_client, command, { expiresIn: 3600 });
};

export const post_review = async(formData) => {
  const itv_no = formData.get("itv_no");
  

  try {
    // user_id 전송
    // `${process.env.CHAT_POST_API}/chat/`
    const response = await fetch(`${process.env.CHAT_POST_API}/report`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        itv_no: itv_no,
        question_number: 3
      }),
    });
    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error("Failed to post review");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post review";
  }
}

export const post_chat = async(formData) => {
  const answer_url = formData.get("answer_url");
  const itv_no = formData.get("itv_no");
  const question_number = formData.get("question_number");

  try {
    // user_id 전송
    // `${process.env.CHAT_POST_API}/chat/`
    const response = await fetch(`${process.env.CHAT_POST_API}/chat`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        answer_url: answer_url,
        itv_no: itv_no,
        question_number: question_number
      }),
    });
    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error("Failed to post chat");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post chat";
  }
}

export const post_new_qs = async(formData) => {
  const user_id = formData.get("user_id");
  const itv_no = formData.get("itv_no");
  const qs_no = formData.get("qs_no");
  const qs_content = formData.get("qs_content");
  const qs_video = formData.get("qs_video_url");
  const qs_audio = formData.get("qs_audio_url");
  const qs_text_url = formData.get("qs_text_url");

  const qs_video_url = `s3://${process.env.BUCKET_NAME}/${qs_video}`
  const qs_audio_url = `s3://${process.env.BUCKET_NAME}/${qs_audio}`


  try {
    // user_id 전송
    const response = await fetch(`${process.env.POST_API}/new_qs`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_id: user_id,
        itv_no: itv_no,
        qs_no: qs_no,
        qs_content: qs_content,
        qs_video_url: qs_video_url,
        qs_audio_url: qs_audio_url,
        qs_text_url: qs_text_url,
      }),
    });
    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error("Failed to post new_qs");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post new_qs";
  }
}

export const post_stt = async(formData) => {
  const user_uuid = formData.get("user_uuid");
  const itv_cnt = formData.get("itv_cnt");
  const file_path = formData.get("file_path");

  try {
    // user_id 전송
    const response = await fetch(`${process.env.STT_POST_API}/stt`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_uuid: user_uuid,
        itv_cnt: itv_cnt,
        file_path: `s3://${process.env.BUCKET_NAME}/${file_path}`
      }),
    });
    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error("Failed to post stt");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post stt";
  }

}

export const save_audio = async(formData) => {
  const blob = formData.get('blob')
  const arrayBuffer = await blob.arrayBuffer();
  const audio_key = formData.get('audio_key')
  const command = new PutObjectCommand({
    Key: audio_key,
    Body: arrayBuffer,
    Bucket: bucket,
  });

  try {
    const response = await s3_client.send(command);
  } catch (err) {
    console.error(err);
  }
}

export const save_video = async(formData) => {
  const video_key = formData.get('video_key')
  const blob = formData.get('blob')
  const arrayBuffer = await blob.arrayBuffer();

  const command = new PutObjectCommand({
    Key: video_key,
    Body: arrayBuffer,
    Bucket: bucket,
  });
  try {
    const response = await s3_client.send(command);
  } catch (err) {
    console.error(err);
  }
}

export const save_report = async(formData) => {
  const report_data = formData.get('report_data')
  const report_json = formData.get('report_json')

  const command = new PutObjectCommand({
    Key: report_data,
    Body: report_json,
    Bucket: bucket,
  });
  try {
    const response = await s3_client.send(command);
  } catch (err) {
    console.error(err);
  }
}

export const create_polly = async (text) => {
  const params = {
    "OutputFormat": "mp3",
    "Text": text,
    "TextType": "text",
    "VoiceId": "Seoyeon"
  };
  const command = new SynthesizeSpeechCommand(params);
  try{
    const data = await polly_client.send(command);
    const arrayBuffer = await data.AudioStream.transformToByteArray();
    return arrayBuffer
  }catch(err){
    console.log(err);
  }
}

export async function uploadFileToS3(formData){
    const file = formData.get('file');
    const arrayBuffer = await file.arrayBuffer();
    const itv_cnt = formData.get('itv_cnt');
    const user_uuid = formData.get('user_uuid');
    const file_key = `${user_uuid}/${itv_cnt}/${file.name}`;
    //const file_key = `coverletter/${user_id}_${Date.now()}_${file.name}`;
    const command = new PutObjectCommand({
      Key: file_key,
      Body: arrayBuffer,
      Bucket: bucket,
    });
  
    try {
      const response = await s3_client.send(command);
      return `s3://${bucket}/${file_key}`;
    } catch (err) {
      throw new Error(`Error uploading file: ${err.message}`);
    }
};

export async function getUserList(user_id) { // 함수 인자에 user_id 추가
  const response = await fetch(`${process.env.GET_API}/get_user/${user_id}`); // 템플릿 리터럴로 user_id 포함
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}

// 자소서 페이지 관심직무, 파일첨부 post
//API_URL2
export async function postItv(formData) {
  const user_id = formData.get("user_id");
  const itv_text_url = formData.get("itv_text_url");
  const itv_cate = formData.get("itv_cate");
  const itv_job = formData.get("itv_job");

  try {
    // user_id 전송
    const response = await fetch(`${process.env.POST_API}/new_itv`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_id: user_id,
        itv_text_url: itv_text_url,
        itv_cate: itv_cate,
        itv_job: itv_job
      }),
    });
    if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);
        throw new Error("Failed to post new_itv");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "itv 정보 등록에 실패했습니다.";
  }
}

export async function postCV(formData) {
  const coverletter_url = formData.get("coverletter_url");
  const position = formData.get("position");
  const itv_no = formData.get("itv_no");
  try {
    // user_id 전송
    //`${process.env.CHAT_POST_API}/coverletter/`
    const response = await fetch(`${process.env.CHAT_POST_API}/coverletter`, {
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        coverletter_url: coverletter_url,
        position: position,
        itv_no: itv_no
      }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        // console.error('Error details:', errorDetails);
        throw new Error("Failed to post coverletter");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post coverletter";
  }
}

export async function getReport(user_id, itv_no) { // 함수 인자에 user_id 추가
  const response = await fetch(`${process.env.GET_API}/get_itv/${user_id}/${itv_no}`); // 템플릿 리터럴로 user_id 포함
  if (!response.ok) throw new Error("Failed to getReport fetch data");
  return response.json();
}

export async function getItv_cnt(user_id) { // 함수 인자에 user_id 추가
  const response = await fetch(`${process.env.GET_API}/get_newitvcnt/${user_id}`); // 템플릿 리터럴로 user_id 포함
  if (!response.ok) throw new Error("Failed to getItv fetch data");
  return response.json();
}

//로그아웃
export async function postLogout(formData) {
  const access_token = formData.get("access_token");

  try {
    // token 전송
    const response = await fetch(`${process.env.GET_API}/act/kakao/logout`, { 
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        access_token: access_token
      }),
    });
   
      if (!response.ok) {
        const errorDetails = await response.text();
        // console.error('Error details:', errorDetails);
        throw new Error("Failed to post logout");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post coverletter";
  }
}

export async function get_kakao(){
  return `${process.env.GET_API}/act/kakao`
}

//회원가입
export async function postSignup(formData) {
  const user_id = formData.get("user_id");
  const name = formData.get("name");
  const nickname = formData.get("nickname");
  const gender = formData.get("gender");
  const birthday = formData.get("birthday");
  const tel = formData.get("tel");

  try {
    //사용자 회원가입 정보 전송
    const response = await fetch(`${process.env.POST_API}/create_user`, { 
      method: 'POST',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_id: user_id,
        name: name,
        nickname: nickname,
        gender: gender,
        birthday: birthday,
        tel: tel
      }),
    });

   
      if (!response.ok) {
        const errorDetails = await response.text();
        // console.error('Error details:', errorDetails);
        throw new Error("Failed to post coverletter");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post signups";
  }
}

export async function getMypageReport(user_id) { // 함수 인자에 user_id 추가
  const response = await fetch(`${process.env.GET_API}/get_itv/${user_id}`); // 템플릿 리터럴로 user_id 포함
  if (!response.ok) throw new Error("Failed to getReport fetch data");
  return response.json();
}


//report db upload patch
export async function patchReport(formData) {
  const user_id = formData.get("user_id");
  const itv_no = formData.get("itv_no");
  const itv_qs_cnt = formData.get("itv_qs_cnt");

  const user_uuid = formData.get("user_uuid");
  const itv_cnt = formData.get("itv_cnt");
  const now = formData.get("now");
  const itv_fb_url = `s3://${process.env.BUCKET_NAME}/${user_uuid}/${itv_cnt}/${now}_report.json`
  console.log(itv_fb_url);
  console.log(user_id);
  console.log(itv_no);
  console.log(itv_qs_cnt);

  try {
    const response = await fetch(`${process.env.POST_API}/update_fb`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_id: user_id,
        itv_no: itv_no,
        itv_qs_cnt: itv_qs_cnt,
        itv_fb_url: `s3://${process.env.BUCKET_NAME}/${user_uuid}/${itv_cnt}/${now}_report.json`
      }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        // console.error('Error details:', errorDetails);
        throw new Error("Failed to post coverletter");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to post coverletter";
  }
}

//mypage information db upload patch
export async function updateLogin(formData) {
  const user_id = formData.get("user_id");
  const name = formData.get("name");
  const nickname = formData.get("nickname");
  const gender = formData.get("gender");
  const birthday = formData.get("birthday");
  const tel = formData.get("tel");

  try {
    const response = await fetch(`${process.env.POST_API}/mod_user`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({
        user_id: user_id,
        name: name,
        nickname: nickname,
        gender: gender,
        birthday: birthday,
        tel: tel
      }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        // console.error('Error details:', errorDetails);
        throw new Error("Failed to update my information");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return "Failed to update my information";
  }
}