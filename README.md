# Loan EMI Calculator – Kubernetes Deployment, Load Balancing & Autoscaling

**Assignment 4 | Cloud Computing / Kubernetes**

A containerized Loan EMI Calculator deployed on Kubernetes using Minikube, Node.js, Express.js, and MongoDB. This project demonstrates containerization, database replication, persistent storage, ingress routing, load balancing, self-healing, performance testing, and automatic horizontal scaling.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Objectives](#2-project-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Project Structure](#5-project-structure)
6. [Application Features](#6-application-features)
7. [Milestone 1 – Application Development](#7-milestone-1--application-development)
8. [Milestone 2 – Docker and Kubernetes Deployment](#8-milestone-2--docker-and-kubernetes-deployment)
9. [Milestone 3 – Ingress and Load Balancing](#9-milestone-3--ingress-and-load-balancing)
10. [Milestone 4 – Load Testing and Autoscaling](#10-milestone-4--load-testing-and-autoscaling)
11. [Installation and Deployment Guide](#11-installation-and-deployment-guide)
12. [Useful Kubernetes Commands](#12-useful-kubernetes-commands)
13. [Testing and Verification](#13-testing-and-verification)
14. [Results and Deliverables](#14-results-and-deliverables)
15. [Conclusion](#15-conclusion)
16. [Repository Information](#16-repository-information)

---

## 1. Project Overview

The purpose of this project is to develop and deploy a Loan EMI (Equated Monthly Instalment) Calculator as a containerized web application on a Kubernetes cluster using Minikube.

The application allows users to calculate monthly loan instalments by providing:

- Loan principal amount
- Annual interest rate
- Loan tenure in months

Every calculation is stored in MongoDB, allowing users to view their recent calculation history.

The backend is developed using Node.js and Express.js, while MongoDB is deployed as a three-member replica set using a Kubernetes StatefulSet with persistent storage.

The web application runs inside multiple Kubernetes pods behind a ClusterIP Service. External traffic is routed through the NGINX Ingress Controller. Kubernetes Horizontal Pod Autoscaler (HPA) is configured to adjust the number of application pods based on CPU utilization.

The project demonstrates how a web application and database can be deployed, monitored, scaled, and maintained using container orchestration.

## 2. Project Objectives

The main objectives are:

- Develop a functional Loan EMI Calculator.
- Implement frontend and backend input validation.
- Store every calculation in MongoDB.
- Containerize the application using Docker.
- Deploy the web application on Kubernetes.
- Configure a MongoDB three-member replica set.
- Implement persistent storage using Persistent Volume Claims.
- Expose the application through NGINX Ingress.
- Demonstrate load balancing between application pods.
- Test Kubernetes self-healing.
- Perform rolling updates and rollback.
- Conduct performance and load testing.
- Monitor
