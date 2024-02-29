from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# request body로 받기 위해 메모라는 클래스 지정
class Memo(BaseModel):
    id:int
    content:str

memos=[]

app = FastAPI()

@app.post("/memos")
# 메모를 추가하는 함수, 여기에 들어오는 request body는 memo라는 값으로 들어옴
def create_memo(memo:Memo):
    memos.append(memo) # 받은 memo 값을 memos라는 배열에 추가
    return '메모 추가 성공'

@app.get("/memos")
def read_memo():
    return memos

@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id==req_memo.id: # 기존에 있는 memo의 id(m.id)랑 request로 온 id가 같을 때
            memo.content=req_memo.content # 기존에 있는 m의 content를 request로 온 memo의 content로 바꿔라
            return '성공'
    return '그런 메모 없음'

@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    for index, memo in enumerate(memos): # index랑 memo 값 같이 써주기 위해 enumerate 함수 사용, enumerate 함수: 배열에서 index와 값을 같이 빼주는 함수
        if memo.id==int(memo_id):
            memos.pop(index)
            return '성공'
    return '그런 메모 없음'

# root 경로에 우리의 static 파일에 있는 html을 호스팅 해줘라라는 의미
app.mount("/", StaticFiles(directory="static", html=True), name="static")