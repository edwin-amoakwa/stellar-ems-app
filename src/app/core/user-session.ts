import { ObjectUtil } from './system.utils';

export class UserSession {
  public static readonly SessionId: string = 'sessionId';
  public static readonly UserID: string = 'userId';
  public static readonly schoolId: string = 'schoolId';
  public static readonly User: string = 'user';
  public static readonly school: string = 'school';
  public static readonly academicTermId: string = 'academicTermId';
  public static readonly loginResponse: string = 'loginResponse';

  static login(loginResponse: any): void {
    // if (!loginResponse.success || !loginResponse.data) {
    //   throw new Error('Invalid login response');
    // }

    // const { data } = loginResponse;
    const { user } = loginResponse;
    // Save the complete data object to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem(UserSession.school, JSON.stringify(loginResponse.user.school));


    localStorage.setItem('userId', user.id);
    localStorage.setItem(this.SessionId, loginResponse.sessionId);
    localStorage.setItem(this.schoolId, loginResponse.id);
    localStorage.setItem(this.loginResponse, JSON.stringify(loginResponse));
  }

  /**
   * Get user data from localStorage
   */
  static getUser(): any | null {
    return this.getAsJson(UserSession.User);
  }

  static getSchool(): any | null {
    return this.getAsJson(UserSession.loginResponse).user.school;
  }

    static getCurrentAcademicTermId(): any | null {
        return this.getAsJson(UserSession.loginResponse).user.school.academicTermId;
    }

  static getAsJson(key: string): any | null {
    const userData = localStorage.getItem(key);
    if (!userData) {
      return null;
    }

    if (ObjectUtil.noValue(userData)) {
      return null;
    }
    return userData ? JSON.parse(userData) : null;
  }


    static getAcademicTerm(): any | null {
        const response = this.getAsJson(UserSession.loginResponse);
        return response?.academicTerm;
    }

  static allowRoute(url): boolean {

      return true;

    url = "/"+url.toLowerCase();
    const permissions = UserSession.getAsJson(this.loginResponse).permissions;
// console.log("permissions",permissions)
    return permissions.some(
      (page) =>{
        // console.log(url,"page",page)
       return page?.pageUrl?.toLowerCase() === url.toLowerCase() && page.enabled;
      }
    );
  }

  static hasPermission(pageCode, actionName): boolean {
    const permissions = UserSession.getAsJson(this.loginResponse).permissions;

    const page = permissions.find(
      (p) => {
        // console.log("pageCode",pageCode, page)
        return p.pageCode?.toLowerCase() === pageCode.toLowerCase() && p.enabled;
      }
    );

    return (
      page?.actions?.some(
        (action) =>
          action.name?.toLowerCase() === actionName.toLowerCase() && action.enabled
      ) ?? false
    );
  }

  /**
   * Get merchant ID from localStorage
   */
  static getMerchantId(): string | null {
    return localStorage.getItem('merchantId');
  }

  /**
   * Get user ID from localStorage
   */
  static getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Clear all session data
   */
  static logout(): void {
    localStorage.clear();
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
