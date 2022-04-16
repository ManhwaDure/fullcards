import Head from "next/head";
import { Component } from "react";
import { apiClientLogin, getApiClient } from "../GetApiClient";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const apiClient = getApiClient();
    apiClient.default
      .finishOidcAuthorization({ callbackUrl: location.href })
      .then(result => {
        if (result.success) {
          apiClientLogin(result.jwt);
        } else {
          alert("로그인에 실패했습니다. 권한이 있는지 확인해주세요.");
        }
      })
      .catch(err => {
        alert("로그인에 실패했습니다.");
        console.error(err);
      })
      .finally(() => {
        location.assign("/edit");
      });
  }
  render() {
    return (
      <div>
        <Head>
          <title>로그인중</title>
        </Head>
        <p>로그인 진행중입니다.... 잠시만 기다려주세요.</p>
      </div>
    );
  }
}
