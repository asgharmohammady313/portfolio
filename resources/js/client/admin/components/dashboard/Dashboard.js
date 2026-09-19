import React, { useEffect, useState } from 'react';
import moment from 'moment';
import HTTP from '../../../common/helpers/HTTP';
import Routes from '../../../common/helpers/Routes';
import Utils from '../../../common/helpers/Utils';

import {
    Card,
    Col,
    Image,
    Row,
    Spin,
    Typography
} from 'antd';

import Icon from '@ant-design/icons';

import { BiArchive } from 'react-icons/bi';
import { GoKeyboard } from 'react-icons/go';
import { BsBriefcase } from 'react-icons/bs';
import { GiSecretBook } from 'react-icons/gi';
import { AiOutlineTeam } from 'react-icons/ai';
import {
    RiServiceLine,
    RiMessage3Line
} from 'react-icons/ri';

import { useHistory } from 'react-router-dom';
import { TinyArea } from '@ant-design/charts';
import styled from 'styled-components';

import StatCard from './StatCard';

const { Text } = Typography;

const imageHeight = 155;

const TemplateLoading = styled.div`
    background: ghostwhite;
    width: 100%;
    height: ${imageHeight}px;
    align-items: center;
    justify-content: center;
    -webkit-box-align: center;
    display: inline-flex;
`;

const Dashboard = () => {
    const history = useHistory();

    // --------------------------------------------------
    // State
    // --------------------------------------------------

    const [loading, setLoading] = useState(true);

    const [currentTemplate, setCurrentTemplate] = useState(null);

    const [colors, setColors] = useState({
        skill: '#1890ff',
        education: '#52c41a',
        experience: '#722ed1',
        project: '#fa8c16',
        service: '#13c2c2',
        visitor: '#eb2f96',
        message: '#2f54eb'
    });

    const [visitorData, setVisitorData] = useState({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        trend: [0, 0]
    });

    const [messageData, setMessageData] = useState({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });

    const [skillData, setSkillData] = useState({
        total: 0
    });

    const [educationData, setEducationData] = useState({
        total: 0
    });

    const [experienceData, setExperienceData] = useState({
        total: 0
    });

    const [projectData, setProjectData] = useState({
        total: 0
    });

    const [servicesData, setServicesData] = useState({
        total: 0
    });

    // --------------------------------------------------
    // Dates
    // --------------------------------------------------

    const todayStartDateUtc = moment
        .utc(moment().startOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    const todayEndDateUtc = moment
        .utc(moment().endOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    const thisWeekStartDateUtc = moment
        .utc(moment().startOf('week').startOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    const thisWeekEndDateUtc = moment
        .utc(moment().endOf('week').endOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    const thisMonthStartDateUtc = moment
        .utc(moment().startOf('month').startOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    const thisMonthEndDateUtc = moment
        .utc(moment().endOf('month').endOf('day'))
        .format('YYYY-MM-DD HH:mm:ss');

    // --------------------------------------------------
    // Load Dashboard Data
    // --------------------------------------------------

    const loadData = (_loading = true) => {
        setLoading(_loading);

        HTTP.get(Routes.api.admin.stats, {
            params: {
                todayStartDate: todayStartDateUtc,
                todayEndDate: todayEndDateUtc,
                thisWeekStartDate: thisWeekStartDateUtc,
                thisWeekEndDate: thisWeekEndDateUtc,
                thisMonthStartDate: thisMonthStartDateUtc,
                thisMonthEndDate: thisMonthEndDateUtc
            }
        })
            .then(response => {
                Utils.handleSuccessResponse(response, () => {
                    const result = response?.data?.payload;

                    if (!result) {
                        return;
                    }

                    // ------------------------------------
                    // Visitors
                    // ------------------------------------

                    let trendArray = [];

                    if (
                        result.visitors &&
                        Array.isArray(result.visitors.trend)
                    ) {
                        trendArray = result.visitors.trend.map(
                            element => {
                                const count = parseInt(
                                    element?.count || 0,
                                    10
                                );

                                return Number.isNaN(count)
                                    ? 0
                                    : count;
                            }
                        );
                    }

                    if (trendArray.length === 0) {
                        trendArray = [0, 0];
                    } else if (trendArray.length === 1) {
                        trendArray.unshift(0);
                    }

                    setVisitorData({
                        total: result.visitors?.total || 0,
                        today: result.visitors?.totalToday || 0,
                        thisWeek:
                            result.visitors?.totalThisWeek || 0,
                        thisMonth:
                            result.visitors?.totalThisMonth || 0,
                        trend: trendArray
                    });

                    // ------------------------------------
                    // Messages
                    // ------------------------------------

                    setMessageData({
                        total: result.message?.total || 0,
                        today: result.message?.totalToday || 0,
                        thisWeek:
                            result.message?.totalThisWeek || 0,
                        thisMonth:
                            result.message?.totalThisMonth || 0
                    });

                    // ------------------------------------
                    // Skills
                    // ------------------------------------

                    setSkillData({
                        total: result.skills?.total || 0
                    });

                    // ------------------------------------
                    // Education
                    // ------------------------------------

                    setEducationData({
                        total: result.educations?.total || 0
                    });

                    // ------------------------------------
                    // Experience
                    // ------------------------------------

                    setExperienceData({
                        total: result.experiences?.total || 0
                    });

                    // ------------------------------------
                    // Projects
                    // ------------------------------------

                    setProjectData({
                        total: result.projects?.total || 0
                    });

                    // ------------------------------------
                    // Services
                    // ------------------------------------

                    setServicesData({
                        total: result.services?.total || 0
                    });

                    // ------------------------------------
                    // Current Template
                    // ------------------------------------

                    if (
                        result.currentTemplate !== undefined &&
                        Array.isArray(Utils.templates)
                    ) {
                        const template =
                            Utils.templates.find(
                                item =>
                                    item.id ===
                                    result.currentTemplate
                            );

                        setCurrentTemplate(
                            template || null
                        );
                    }
                });
            })
            .catch(error => {
                Utils.handleException(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // --------------------------------------------------
    // Initial Load
    // --------------------------------------------------

    useEffect(() => {
        setColors({
            skill: Utils.randomHexColor(),
            education: Utils.randomHexColor(),
            experience: Utils.randomHexColor(),
            project: Utils.randomHexColor(),
            service: Utils.randomHexColor(),
            visitor: Utils.randomHexColor(),
            message: Utils.randomHexColor()
        });

        loadData();
    }, []);

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <React.Fragment>

            {/* ==========================================
                TOP STAT CARDS
            =========================================== */}

            <Row gutter={24}>

                <Col
                    xl={24}
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                >
                    <Row gutter={24}>

                        {/* Skill */}

                        <Col
                            xl={6}
                            lg={6}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <StatCard
                                link={
                                    Routes.web.admin
                                        .portfolioSkills
                                }
                                loading={loading}
                                icon={
                                    <Icon
                                        component={GoKeyboard}
                                    />
                                }
                                color={colors.skill}
                                title="Skill"
                                number={skillData.total}
                            />
                        </Col>

                        {/* Education */}

                        <Col
                            xl={6}
                            lg={6}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <StatCard
                                link={
                                    Routes.web.admin
                                        .portfolioEducation
                                }
                                loading={loading}
                                icon={
                                    <Icon
                                        component={GiSecretBook}
                                    />
                                }
                                color={colors.education}
                                title="Education"
                                number={educationData.total}
                            />
                        </Col>

                        {/* Experience */}

                        <Col
                            xl={6}
                            lg={6}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <StatCard
                                link={
                                    Routes.web.admin
                                        .portfolioExperiences
                                }
                                loading={loading}
                                icon={
                                    <Icon
                                        component={BsBriefcase}
                                    />
                                }
                                color={colors.experience}
                                title="Experience"
                                number={
                                    experienceData.total
                                }
                            />
                        </Col>

                        {/* Project */}

                        <Col
                            xl={6}
                            lg={6}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <StatCard
                                link={
                                    Routes.web.admin
                                        .portfolioProjects
                                }
                                loading={loading}
                                icon={
                                    <Icon
                                        component={BiArchive}
                                    />
                                }
                                color={colors.project}
                                title="Project"
                                number={projectData.total}
                            />
                        </Col>

                    </Row>
                </Col>

                {/* ==========================================
                    MAIN SECTION
                =========================================== */}

                <Col
                    xl={18}
                    lg={18}
                    md={24}
                    sm={24}
                    xs={24}
                >
                    <Row gutter={24}>

                        {/* Service */}

                        <Col
                            xl={8}
                            lg={10}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <StatCard
                                link={
                                    Routes.web.admin
                                        .portfolioServices
                                }
                                loading={loading}
                                icon={
                                    <Icon
                                        component={RiServiceLine}
                                    />
                                }
                                color={colors.service}
                                title="Service"
                                number={
                                    servicesData.total
                                }
                            />
                        </Col>

                        {/* Visitor Trend */}

                        <Col
                            xl={16}
                            lg={14}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <Card
                                hoverable
                                bordered={false}
                                loading={loading}
                                className="z-shadow"
                                style={{
                                    cursor: 'default'
                                }}
                            >
                                <Row>

                                    <Col
                                        md={24}
                                        sm={24}
                                        xs={24}
                                        style={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Text type="secondary">
                                            Visitor Trend
                                        </Text>
                                    </Col>

                                    <Col
                                        md={24}
                                        sm={24}
                                        xs={24}
                                        style={{
                                            textAlign: 'center'
                                        }}
                                    >
                                        <TinyArea
                                            height={75}
                                            autoFit
                                            data={
                                                visitorData.trend
                                            }
                                            smooth
                                        />
                                    </Col>

                                </Row>
                            </Card>
                        </Col>

                        {/* ==================================
                            VISITORS
                        =================================== */}

                        <Col
                            xl={24}
                            lg={24}
                            md={24}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <Card
                                hoverable
                                onClick={() => {
                                    history.push(
                                        Routes.web.admin
                                            .visitors
                                    );
                                }}
                                bordered={false}
                                loading={loading}
                                className="z-shadow"
                            >
                                <Row>

                                    <Col
                                        md={24}
                                        sm={24}
                                        xs={24}
                                        style={{
                                            textAlign: 'center',
                                            paddingBottom: '14px'
                                        }}
                                    >
                                        <Text type="secondary">
                                            Visitor
                                        </Text>
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        AiOutlineTeam
                                                    }
                                                />
                                            }
                                            color={
                                                colors.visitor
                                            }
                                            title="Total"
                                            number={
                                                visitorData.total
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        AiOutlineTeam
                                                    }
                                                />
                                            }
                                            color={
                                                colors.visitor
                                            }
                                            title="This Month"
                                            number={
                                                visitorData.thisMonth
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        AiOutlineTeam
                                                    }
                                                />
                                            }
                                            color={
                                                colors.visitor
                                            }
                                            title="This Week"
                                            number={
                                                visitorData.thisWeek
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        AiOutlineTeam
                                                    }
                                                />
                                            }
                                            color={
                                                colors.visitor
                                            }
                                            title="Today"
                                            number={
                                                visitorData.today
                                            }
                                        />
                                    </Col>

                                </Row>
                            </Card>
                        </Col>

                        {/* ==================================
                            MESSAGES
                        =================================== */}

                        <Col
                            xl={24}
                            lg={24}
                            md={24}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <Card
                                hoverable
                                onClick={() => {
                                    history.push(
                                        Routes.web.admin
                                            .messages
                                    );
                                }}
                                bordered={false}
                                loading={loading}
                                className="z-shadow"
                            >
                                <Row>

                                    <Col
                                        md={24}
                                        sm={24}
                                        xs={24}
                                        style={{
                                            textAlign: 'center',
                                            paddingBottom: '14px'
                                        }}
                                    >
                                        <Text type="secondary">
                                            Message
                                        </Text>
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        RiMessage3Line
                                                    }
                                                />
                                            }
                                            color={
                                                colors.message
                                            }
                                            title="Total"
                                            number={
                                                messageData.total
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        RiMessage3Line
                                                    }
                                                />
                                            }
                                            color={
                                                colors.message
                                            }
                                            title="This Month"
                                            number={
                                                messageData.thisMonth
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        RiMessage3Line
                                                    }
                                                />
                                            }
                                            color={
                                                colors.message
                                            }
                                            title="This Week"
                                            number={
                                                messageData.thisWeek
                                            }
                                        />
                                    </Col>

                                    <Col
                                        md={6}
                                        sm={24}
                                        xs={24}
                                    >
                                        <StatCard
                                            isCard={false}
                                            loading={loading}
                                            icon={
                                                <Icon
                                                    component={
                                                        RiMessage3Line
                                                    }
                                                />
                                            }
                                            color={
                                                colors.message
                                            }
                                            title="Today"
                                            number={
                                                messageData.today
                                            }
                                        />
                                    </Col>

                                </Row>
                            </Card>
                        </Col>

                    </Row>
                </Col>

                {/* ==========================================
                    RIGHT SECTION
                =========================================== */}

                <Col
                    xl={6}
                    lg={6}
                    md={24}
                    sm={24}
                    xs={24}
                >
                    <Row gutter={24}>

                        {/* Current Template */}

                        <Col
                            xl={24}
                            lg={24}
                            md={12}
                            sm={24}
                            xs={24}
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <Card
                                onClick={() => {
                                    history.push(
                                        Routes.web.admin
                                            .portfolioConfig
                                    );
                                }}
                                hoverable
                                bordered={false}
                                size="small"
                                loading={loading}
                                className="z-shadow"
                                cover={
                                    currentTemplate?.image ? (
                                        <Image
                                            alt={
                                                currentTemplate?.title ||
                                                'Current Template'
                                            }
                                            width="100%"
                                            height={imageHeight}
                                            style={{
                                                objectFit: 'fill',
                                                opacity: '0.8'
                                            }}
                                            preview={false}
                                            src={
                                                currentTemplate.image
                                            }
                                        />
                                    ) : (
                                        <TemplateLoading>
                                            <Spin />
                                        </TemplateLoading>
                                    )
                                }
                            >
                                <Card.Meta
                                    title={
                                        <small>
                                            {currentTemplate?.title ||
                                                'Portfolio Template'}
                                        </small>
                                    }
                                    description={
                                        <small>
                                            Change Template
                                        </small>
                                    }
                                />
                            </Card>
                        </Col>

                        {/* Portfolio Information */}

                        <Col
                            xl={24}
                            lg={24}
                            md={12}
                            sm={24}
                            xs={24}
                        >
                            <Card
                                bordered={false}
                                size="small"
                                className="z-shadow"
                            >
                                <Card.Meta
                                    title={
                                        <small>
                                            Portfolio Dashboard
                                        </small>
                                    }
                                    description={
                                        <small>
                                            Manage your portfolio
                                            information, projects,
                                            skills, services and
                                            messages.
                                        </small>
                                    }
                                />
                            </Card>
                        </Col>

                    </Row>
                </Col>

            </Row>
        </React.Fragment>
    );
};

export default React.memo(Dashboard);