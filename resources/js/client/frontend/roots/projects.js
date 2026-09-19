import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Image, Row, Col, Radio } from 'antd';

import '../../common/assets/css/projects.css';
import ProjectPopup from '../components/ProjectPopup';
import Routes from '../../common/helpers/Routes';
import HTTP from '../../common/helpers/HTTP';
import Utils from '../../common/helpers/Utils';

const accentElement = document.querySelector('[data-accentcolor]');

const accentColor = accentElement
    ? accentElement.dataset.accentcolor
    : null;

const thumbnailStyle = {
    height: '150px',
    width: '100%',
    transition: '0.3s ease',
    objectFit: 'cover'
};

function App() {
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);

    const [selectedCategory, setSelectedCategory] =
        useState(null);

    const [selectedProject, setSelectedProject] =
        useState(null);

    // --------------------------------------------------
    // Initial Load
    // --------------------------------------------------

    useEffect(() => {
        if (accentColor) {
            Utils.changeAccentColor(accentColor);
        }

        loadData();
    }, []);

    // --------------------------------------------------
    // Load Projects
    // --------------------------------------------------

    const loadData = () => {
        setLoading(true);

        HTTP.get(Routes.api.frontend.projects, {
            isPrivate: false
        })
            .then(response => {
                Utils.handleSuccessResponse(response, () => {
                    const projects =
                        response?.data?.payload || [];

                    setData(projects);

                    if (projects.length > 0) {
                        const newCategories = [];

                        projects.forEach(project => {
                            try {
                                const projectCategories =
                                    JSON.parse(
                                        project.categories || '[]'
                                    );

                                if (
                                    Array.isArray(
                                        projectCategories
                                    )
                                ) {
                                    projectCategories.forEach(
                                        category => {
                                            if (
                                                category &&
                                                !newCategories.includes(
                                                    category
                                                )
                                            ) {
                                                newCategories.push(
                                                    category
                                                );
                                            }
                                        }
                                    );
                                }
                            } catch (error) {
                                console.error(
                                    'Invalid project categories:',
                                    error
                                );
                            }
                        });

                        setCategories(newCategories);
                    } else {
                        setCategories([]);
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
    // Filter Projects
    // --------------------------------------------------

    const filteredProjects = data.filter(project => {
        if (selectedCategory === null) {
            return true;
        }

        try {
            const projectCategories = JSON.parse(
                project.categories || '[]'
            );

            return (
                Array.isArray(projectCategories) &&
                projectCategories.includes(
                    selectedCategory
                )
            );
        } catch (error) {
            return false;
        }
    });

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <React.Fragment>

            <Row>
                <Col span={24}>

                    <Row>

                        {/* --------------------------------
                            Categories
                        --------------------------------- */}

                        <Col
                            span={24}
                            className="text-center"
                            style={{
                                marginBottom: '24px'
                            }}
                        >
                            {categories.length !== 0 && (
                                <div data-aos="zoom-in">

                                    <Radio.Group
                                        value={
                                            selectedCategory
                                        }
                                        onChange={e => {
                                            setSelectedCategory(
                                                e.target.value
                                            );
                                        }}
                                    >

                                        {/* All Projects */}

                                        <Radio.Button
                                            value={null}
                                        >
                                            All
                                        </Radio.Button>

                                        {/* Categories */}

                                        {categories.map(
                                            (
                                                category,
                                                index
                                            ) => (
                                                <Radio.Button
                                                    key={index}
                                                    value={
                                                        category
                                                    }
                                                    style={{
                                                        textTransform:
                                                            'capitalize'
                                                    }}
                                                >
                                                    {category}
                                                </Radio.Button>
                                            )
                                        )}

                                    </Radio.Group>

                                </div>
                            )}
                        </Col>

                        {/* --------------------------------
                            Projects
                        --------------------------------- */}

                        <Col
                            span={24}
                            className="text-center"
                        >
                            <Row
                                justify="center"
                                gutter={32}
                            >

                                {filteredProjects.map(
                                    (item, index) => (
                                        <Col
                                            key={
                                                item.id ||
                                                index
                                            }
                                            xl={6}
                                            lg={6}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                            data-aos="fade-up"
                                            data-aos-anchor-placement="top-bottom"
                                            style={{
                                                marginBottom:
                                                    '24px'
                                            }}
                                        >

                                            <Card
                                                onClick={() => {
                                                    setSelectedProject(
                                                        item
                                                    );

                                                    setModalVisible(
                                                        true
                                                    );
                                                }}
                                                loading={
                                                    loading
                                                }
                                                bodyStyle={{
                                                    padding:
                                                        '14px'
                                                }}
                                                hoverable
                                                className="z-hover z-shadow"
                                                bordered={false}
                                                cover={
                                                    <div
                                                        style={{
                                                            opacity:
                                                                '0.7'
                                                        }}
                                                    >
                                                        <Image
                                                            width="100%"
                                                            src={
                                                                item.thumbnail
                                                                    ? `${Utils.backend}/${item.thumbnail}`
                                                                    : ''
                                                            }
                                                            style={
                                                                thumbnailStyle
                                                            }
                                                            preview={
                                                                false
                                                            }
                                                            placeholder={
                                                                true
                                                        }
                                                            alt={
                                                                item.title ||
                                                                'Project'
                                                            }
                                                        />
                                                    </div>
                                                }
                                                actions={[
                                                    <React.Fragment
                                                        key="view"
                                                    >
                                                        See Details
                                                    </React.Fragment>
                                                ]}
                                            >

                                                <Card.Meta
                                                    title={
                                                        item.title ||
                                                        'Project'
                                                    }
                                                />

                                            </Card>

                                        </Col>
                                    )
                                )}

                            </Row>
                        </Col>

                    </Row>

                </Col>
            </Row>

            {/* --------------------------------------------
                Project Details Popup
            --------------------------------------------- */}

            {modalVisible && (
                <ProjectPopup
                    title={
                        selectedProject
                            ? selectedProject.title
                            : ''
                    }
                    project={selectedProject}
                    visible={modalVisible}
                    handleCancel={() => {
                        setModalVisible(false);
                        setSelectedProject(null);
                    }}
                />
            )}

        </React.Fragment>
    );
}

// --------------------------------------------------
// React Root
// --------------------------------------------------

const projectRoot =
    document.getElementById('react-project-root');

if (projectRoot) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        projectRoot
    );
}