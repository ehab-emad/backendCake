"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
class Employee {
    constructor(id, authUserId, address, role, active, profileImage) {
        this.id = id;
        this.authUserId = authUserId;
        this.address = address;
        this.role = role;
        this.active = active;
        this.profileImage = profileImage;
        this.images = [];
    }
}
exports.Employee = Employee;
