import { Icon , Input, Pagination , message} from 'antd';
import './Issue.scss';
import * as React from 'react';
import intl from 'react-intl-universal';
import cs from 'classnames';
import moment from 'moment';

//api
 import {  issueList , submitIssue ,  issueType, } from '../api/Issue';


interface Istate {
    issueText: string;
    issueType: any[];
    showIssueType: boolean;
    value: string;
    contact: string;
    [propName:string]:any;
    validator: boolean;
    data:any[];
    page:number;
    count: number;
    issueId:number;
    total:number;
}

const { TextArea } =  Input; 
class Issue extends React.PureComponent<any, Istate> {
    state:Istate;
    constructor(props) {
        super(props);
        this.state = {
            issueText:"-",
            issueType:[],
            issueId:0,
            showIssueType:false,
            value:'',
            contact:'',
            validator: false,
            data:[],
            page:1,  //页数
            count:2, //每页条数
            total:0 //总条数
        }

        this.apiHandle(issueType).then(res => {
            this.setState({
                issueType:res.data 
            })
        });

        this.apiHandle(issueList,{numPerPage:2,pageNum:1}).then(res => {
           
            this.setState({
                data:res.data,
                total:Number(res.page.totalCount)
            })
        });
      /*   this.apiHandle(issueType);
        this.apiHandle(issueType); */
    }

    apiHandle = async (fn,data?) => {
        const res = await fn(data);
        return res;
    }

    showIssueTypeHandle = () => {
        this.setState((preState) => {
            return {
                showIssueType: !preState.showIssueType
            }
        })
    }

    setIssue = (v:string, id:number):void  => {
        this.setState({
            issueText:v,
            issueId:id
        });
        
        this.showIssueTypeHandle();
    }

    textAreaChange = (e:React.ChangeEvent, type:string):void => {
        const value = (e.target as any).value;
    
        if(value.length >= 500) return;
        this.setState({
           [type]: value,
           validator:false
        });
      
    }

    submit = () => {
     const { value , contact, issueId  ,validator} = this.state;
     if(validator) return;
         this.setState({
            validator:true
         });
        
       const data = {
            contact,
            content:value,
            questionId:issueId
        };

        const bool = (Object as any).values(data).every(v => v);
      
       if(!bool) return ;
        
        this.apiHandle(submitIssue, data).then(res => {
            message.destroy();
            message.info(res.msg);

            if(res.status === 110009) {
                this.apiHandle(issueList,{numPerPage:2,pageNum:1}).then(res => {
           
                    this.setState({
                        data:res.data,
                        total:Number(res.page.totalCount),
                        validator:false,
                        value:'',
                        contact:'',
                        issueText:'-'
                    })
                });
            }
        })
      
        
    }

    pageChange =(page:number, pageSize:number):void => {
        this.apiHandle(issueList,{numPerPage:2,pageNum:page}).then(res => {
           
            this.setState({
                data:res.data,
                total:Number(res.page.totalCount)
            })
        });
    }

    render() {
        const { issueText, issueType, showIssueType, value, contact, validator, data }  = this.state;
        const selectList = issueType.map((v, i) => {
            return (
                <p key={i.toString()} onClick={() => this.setIssue(v.content, v.id) }>
                    {v.content}
                </p>
            )
        });
        const issueList = data.map((v, i) => {

            return (
                        <li key={i.toString()} className="his-list">
                            <div className="ask">
                                <p>
                                    <span className="red">{intl.get("咨询")}：</span>
                                    <span>{v.content}</span>
                                </p>
                                <p className="gray">{moment(v.createTime).format('YYYY-DD-HH HH:mm:ss ')}</p>
                            </div>
                            <div className="respones">
                                <p>
                                    <span className="red">{intl.get('回复')}：</span>
                                    <span>{v.content}</span>
                                </p>
                                <p className="gray">{moment(v.createTime).format('YYYY-DD-HH HH:mm:ss ')}</p>
                            </div>
                        </li>
                    )
        })
        return (
            <div className="issue">
                <h3>{intl.get('提交请求')}</h3>
                <div className="type">
                    <h4>{intl.get('问题分类')}<span>*</span></h4>
                    <div className="select-wrap">
                        <div className="select-text">
                            <p>{issueText}</p>
                            <Icon 
                                type="down"  
                                className={cs("dow-arrows",  {'rotate': showIssueType} )}
                                onClick={this.showIssueTypeHandle}
                            />
                        </div>
                        <div className={cs("select-list-wrap", {'show': showIssueType})} >
                            {selectList}
                        </div>
                    </div>
                    <p className={cs("tips",{'showTypeTips': (issueText === '-' || !issueText) && validator})} >
                        {intl.get('请输入联系方式')}
                    </p>
                </div>

                <div className="issue-des">
                    <h4>{intl.get('问题描述')}<span>*</span></h4>
                    <TextArea 
                         rows={6}
                         value={value}
                         onChange={(e) => this.textAreaChange(e, 'value')}
                    />
                    <p>{intl.get('请输入您请求的详情。我们的一名支持人员将尽快答复您。')}</p>
                </div>

                <div className="issue-contact">
                    <h4>{intl.get("联系方式")}<span>*</span></h4>
                    <Input  
                         value={contact}
                         onChange={(e) => this.textAreaChange(e, 'contact')}
                    />
                    <p className={cs("tips",{'showLinkTips': !contact && validator})} >{intl.get("请输入联系方式")}</p>
                </div>

                <div className="submit" onClick={this.submit}>{intl.get("提交")}</div>
                
                <div className="issue-list-wrap">
                    <h4>{intl.get("我的咨询")}</h4>
                    <ul className="issue-list">
                        {issueList}
                    </ul>

                    <Pagination
                        className="iss-pagination"
                        total={this.state.total}
                        defaultPageSize={2}
                        hideOnSinglePage
                        onChange={this.pageChange}
                    />
                </div>
            </div>
        )
    }
}


export default Issue;